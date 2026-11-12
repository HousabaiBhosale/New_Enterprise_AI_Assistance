import os
import shutil
from datetime import datetime
from typing import Optional, List
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base, get_db, sync_postgres_sequences
import models
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_user_optional
)
from audit import log_audit
from vector_store import init_qdrant, ingest_document_text, get_qdrant_client, get_embedding_vector
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from agents.coordinator import process_query_with_details, process_query
from agents.tools.reporting import create_domain_report, REPORTS_DIR, ensure_reports_dir

# Ensure DB tables exist
models.Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_qdrant()
    ensure_reports_dir()
    sync_postgres_sequences()
    yield

app = FastAPI(
    title="ResolveX Enterprise Multi-Agent API",
    description="Backend API for ResolveX Enterprise Multi-Agent Operating System with Multi-Agent Workflows, RAG, RBAC, and HITL",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Base & Health Endpoint
# -------------------------------------------------------------
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Agentic Enterprise AI Assistant",
        "modules": ["HR Agent", "Sales Agent", "Support Agent", "LangGraph Supervisor", "Qdrant RAG", "Audit Trail", "HITL Approvals"]
    }

# -------------------------------------------------------------
# Authentication & RBAC
# -------------------------------------------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "employee"
    department: Optional[str] = "General"

@app.post("/api/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.name})
    log_audit(db, action="USER_LOGIN", resource="AUTH", details=f"User {user.email} logged in successfully", user_id=user.id, user_name=user.name)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department
        }
    }

@app.post("/api/auth/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = models.User(
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=request.role or "employee",
        department=request.department or "General"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role, "name": user.name})
    log_audit(db, action="USER_REGISTER", resource="AUTH", details=f"Registered user {user.email} with role {user.role}", user_id=user.id, user_name=user.name)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department
        }
    }

@app.get("/api/auth/me")
def get_current_user_profile(user: models.User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "department": user.department
    }

# -------------------------------------------------------------
# Chat & Real-Time LangGraph Query Processing
# -------------------------------------------------------------
class ChatRequest(BaseModel):
    query: str
    user_id: Optional[int] = 1
    user_role: Optional[str] = None
    history: Optional[List[dict]] = None

@app.post("/api/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db), current_user: Optional[models.User] = Depends(get_current_user_optional)):
    has_user = current_user and hasattr(current_user, 'name')
    user_name = current_user.name if has_user else f"User-{request.user_id}"
    user_id = current_user.id if has_user else request.user_id
    user_role = current_user.role if has_user else (request.user_role or "admin")
    
    try:
        details = process_query_with_details(
            request.query,
            history=request.history,
            user_role=user_role,
            user_id=user_id,
            user_name=user_name
        )
        log_audit(
            db,
            action="CHAT_QUERY",
            resource=details["agent_used"],
            details=f"Prompt: '{request.query[:100]}'",
            user_id=user_id,
            user_name=user_name
        )
        return {
            "response": details["response"],
            "agent_used": details["agent_used"],
            "steps": details["steps"],
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        log_audit(db, action="CHAT_ERROR", resource="CORE_API", details=str(e), user_id=user_id, user_name=user_name, status="FAILED")
        return {
            "response": f"Error processing query with agent workflow: {str(e)}",
            "agent_used": "Error Fallback",
            "steps": [{"name": "Error Handling", "status": "failed", "detail": str(e)}],
            "timestamp": datetime.utcnow().isoformat()
        }

# WebSocket for live real-time bidirectional chat communication
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            query = data.get("query", "")
            if not query.strip():
                continue

            # Stream progressive workflow updates
            await websocket.send_json({"type": "step", "step": "Supervisor Intent Routing", "status": "running"})
            details = process_query_with_details(query)
            
            await websocket.send_json({"type": "step", "step": f"Executing {details['agent_used']}", "status": "running"})
            await websocket.send_json({
                "type": "response",
                "response": details["response"],
                "agent_used": details["agent_used"],
                "steps": details["steps"],
                "timestamp": datetime.utcnow().isoformat()
            })
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})

# -------------------------------------------------------------
# Human-in-the-Loop (HITL) Approvals
# -------------------------------------------------------------
class ActionRequest(BaseModel):
    action: str  # approve or reject
    notes: Optional[str] = ""

@app.get("/api/approvals")
def get_approvals(db: Session = Depends(get_db)):
    approvals = db.query(models.ApprovalRequest).order_by(models.ApprovalRequest.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "category": a.category,
            "agent": a.requested_by_agent,
            "impact": a.impact,
            "conf": a.confidence,
            "status": a.status,
            "created_at": a.created_at.strftime("%b %d, %Y %H:%M") if a.created_at else "N/A",
            "reviewer": a.reviewer_name
        }
        for a in approvals
    ]

@app.post("/api/approvals/{approval_id}/action")
def take_approval_action(
    approval_id: int,
    request: ActionRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    approval = db.query(models.ApprovalRequest).filter(models.ApprovalRequest.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    has_user = current_user and hasattr(current_user, 'name')
    reviewer = current_user.name if has_user else "Authorized Manager"
    if request.action.lower() == "approve":
        approval.status = "Approved"
        approval.reviewed_at = datetime.utcnow()
        approval.reviewer_name = reviewer
        log_audit(db, action="HITL_APPROVED", resource="HITL_APPROVAL", details=f"Approved #{approval.id} ({approval.title}) by {reviewer}")
        db.commit()
        return {"status": "success", "message": f"Approval #{approval.id} confirmed and authorized."}
    else:
        approval.status = "Rejected"
        approval.reviewed_at = datetime.utcnow()
        approval.reviewer_name = reviewer
        log_audit(db, action="HITL_REJECTED", resource="HITL_APPROVAL", details=f"Rejected #{approval.id} ({approval.title}) by {reviewer}")
        db.commit()
        return {"status": "success", "message": f"Approval #{approval.id} was rejected."}

# Legacy endpoint support
class ApprovalRequestLegacy(BaseModel):
    action_id: str
    approved: bool

@app.post("/api/approve")
def approve_action(request: ApprovalRequestLegacy, db: Session = Depends(get_db)):
    action = "approve" if request.approved else "reject"
    log_audit(db, action=f"ACTION_{action.upper()}", resource="HITL", details=f"Action ID: {request.action_id}")
    return {
        "status": "success" if request.approved else "rejected",
        "message": f"Action {request.action_id} {'approved and executed' if request.approved else 'was rejected'}."
    }

# -------------------------------------------------------------
# Knowledge Documents & RAG Management
# -------------------------------------------------------------
@app.get("/api/documents")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(models.KnowledgeDocument).order_by(models.KnowledgeDocument.uploaded_at.desc()).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "title": d.title,
            "category": d.category,
            "file_size": d.file_size,
            "chunks": d.chunk_count,
            "uploaded_at": d.uploaded_at.strftime("%b %d, %Y") if d.uploaded_at else "N/A"
        }
        for d in docs
    ]

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: Optional[str] = Form("General"),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    filename = file.filename
    content_bytes = await file.read()
    
    # Save locally to data/docs directory
    docs_dir = os.path.join(os.path.dirname(__file__), "data", "docs")
    if not os.path.exists(docs_dir):
        os.makedirs(docs_dir)
        
    save_path = os.path.join(docs_dir, filename)
    with open(save_path, "wb") as f:
        f.write(content_bytes)

    # Decode text
    try:
        text_content = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text_content = content_bytes.decode("latin-1", errors="ignore")

    # Ingest chunks into Qdrant
    chunk_count = ingest_document_text(
        filename=filename,
        content=text_content,
        title=filename.replace("_", " ").replace(".md", "").replace(".txt", "").title(),
        category=category
    )

    size_kb = f"{len(content_bytes) / 1024:.1f} KB"
    
    # Save to SQL DB
    doc_record = models.KnowledgeDocument(
        filename=filename,
        title=filename.replace("_", " ").title(),
        category=category,
        file_size=size_kb,
        chunk_count=chunk_count
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)

    user_name = current_user.name if (current_user and hasattr(current_user, 'name')) else "System"
    log_audit(db, action="DOCUMENT_UPLOADED", resource="QDRANT_RAG", details=f"Indexed '{filename}' ({chunk_count} chunks)", user_name=user_name)

    return {
        "status": "success",
        "message": f"Document '{filename}' successfully ingested and vectorized in Qdrant.",
        "chunks_indexed": chunk_count,
        "document_id": doc_record.id
    }

class CreateKnowledgeDocumentRequest(BaseModel):
    title: str
    category: str = "General"
    content: str
    filename: Optional[str] = None

@app.post("/api/documents/create")
def create_document(
    payload: CreateKnowledgeDocumentRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    raw_title = payload.title.strip()
    if not raw_title:
        raise HTTPException(status_code=400, detail="Document title is required")
    if not payload.content or not payload.content.strip():
        raise HTTPException(status_code=400, detail="Document content cannot be empty")
        
    raw_name = payload.filename.strip() if payload.filename and payload.filename.strip() else raw_title.lower().replace(" ", "_").replace("-", "_")
    if not (raw_name.endswith(".md") or raw_name.endswith(".txt")):
        raw_name = f"{raw_name}.md"
        
    docs_dir = os.path.join(os.path.dirname(__file__), "data", "docs")
    if not os.path.exists(docs_dir):
        os.makedirs(docs_dir)
        
    save_path = os.path.join(docs_dir, raw_name)
    with open(save_path, "w", encoding="utf-8") as f:
        f.write(payload.content)

    content_bytes = payload.content.encode("utf-8")
    chunk_count = ingest_document_text(
        filename=raw_name,
        content=payload.content,
        title=raw_title,
        category=payload.category
    )
    size_kb = f"{len(content_bytes) / 1024:.1f} KB" if len(content_bytes) >= 1024 else f"{len(content_bytes)} B"

    doc_record = models.KnowledgeDocument(
        filename=raw_name,
        title=raw_title,
        category=payload.category,
        file_size=size_kb,
        chunk_count=chunk_count
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)

    user_name = current_user.name if (current_user and hasattr(current_user, 'name')) else "Admin"
    log_audit(db, action="DOCUMENT_CREATED", resource="QDRANT_RAG", details=f"Created & indexed '{raw_name}' ({chunk_count} chunks)", user_name=user_name)

    return {
        "status": "success",
        "message": f"Knowledge base '{raw_title}' created and vectorized into Qdrant ({chunk_count} chunks).",
        "chunks_indexed": chunk_count,
        "document_id": doc_record.id,
        "filename": raw_name,
        "title": raw_title,
        "category": payload.category,
        "file_size": size_kb
    }

@app.get("/api/documents/{doc_id}/content")
def get_document_content(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.KnowledgeDocument).filter(models.KnowledgeDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    docs_dir = os.path.join(os.path.dirname(__file__), "data", "docs")
    file_path = os.path.join(docs_dir, doc.filename)
    
    content = ""
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception:
            with open(file_path, "r", encoding="latin-1", errors="ignore") as f:
                content = f.read()
                
    chunks = []
    if "## " in content:
        raw_chunks = content.split("\n## ")
        if raw_chunks:
            if raw_chunks[0].strip():
                chunks.append(raw_chunks[0].strip())
            for c in raw_chunks[1:]:
                if c.strip():
                    chunks.append("## " + c.strip())
    else:
        paragraphs = content.split("\n\n")
        chunks = [p.strip() for p in paragraphs if len(p.strip()) > 20]
        if not chunks and content.strip():
            chunks = [content.strip()]
            
    return {
        "id": doc.id,
        "filename": doc.filename,
        "title": doc.title,
        "category": doc.category,
        "file_size": doc.file_size,
        "chunks": doc.chunk_count,
        "uploaded_at": doc.uploaded_at.strftime("%b %d, %Y") if doc.uploaded_at else "N/A",
        "content": content,
        "chunks_list": chunks
    }

class SearchKnowledgeRequest(BaseModel):
    query: str
    category: Optional[str] = None
    limit: Optional[int] = 4

@app.post("/api/documents/search")
def search_documents(payload: SearchKnowledgeRequest):
    if not payload.query or not payload.query.strip():
        return {"query": payload.query, "results": []}
    
    client = get_qdrant_client()
    vec = get_embedding_vector(payload.query)
    
    q_filter = None
    if payload.category and payload.category.lower() != "all":
        q_filter = Filter(must=[FieldCondition(key="category", match=MatchValue(value=payload.category))])
        
    try:
        results = client.search(
            collection_name="enterprise_docs",
            query_vector=vec,
            limit=payload.limit or 4,
            query_filter=q_filter
        )
        matches = []
        for hit in results:
            score = getattr(hit, "score", 0.0)
            payload_data = getattr(hit, "payload", {}) or {}
            # Score conversion: Cosine similarity ranges -1 to 1, normalized to percentage
            pct_score = round(max(0.0, float(score)) * 100, 1)
            matches.append({
                "id": str(getattr(hit, "id", "")),
                "score": pct_score,
                "source": payload_data.get("source", "Unknown"),
                "title": payload_data.get("title", "Document"),
                "category": payload_data.get("category", "General"),
                "text": payload_data.get("text", "")
            })
        return {
            "query": payload.query,
            "category": payload.category or "All",
            "matches_count": len(matches),
            "results": matches
        }
    except Exception as e:
        return {"query": payload.query, "error": str(e), "results": []}

@app.delete("/api/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.KnowledgeDocument).filter(models.KnowledgeDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    filename = doc.filename
    # Clean up from Qdrant
    try:
        client = get_qdrant_client()
        client.delete(
            collection_name="enterprise_docs",
            points_selector=Filter(must=[FieldCondition(key="source", match=MatchValue(value=filename))])
        )
    except Exception as e:
        print(f"Notice: Qdrant delete error for {filename}: {e}")

    # Remove physical file if present
    try:
        docs_dir = os.path.join(os.path.dirname(__file__), "data", "docs")
        file_path = os.path.join(docs_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Notice: File delete error for {filename}: {e}")

    db.delete(doc)
    db.commit()
    log_audit(db, action="DOCUMENT_DELETED", resource="QDRANT_RAG", details=f"Removed '{filename}' from repository")
    return {"status": "success", "message": f"Document '{filename}' removed from database and Qdrant index."}

# -------------------------------------------------------------
# Reporting (PDF & Excel generation & download)
# -------------------------------------------------------------
class GenerateReportRequest(BaseModel):
    report_type: str  # sales, hr, support, system
    file_format: Optional[str] = "pdf"  # pdf, xlsx

@app.get("/api/reports")
def list_reports():
    ensure_reports_dir()
    files = []
    for f in os.listdir(REPORTS_DIR):
        if f.endswith(".pdf") or f.endswith(".xlsx"):
            full_path = os.path.join(REPORTS_DIR, f)
            stat = os.stat(full_path)
            size_mb = f"{stat.st_size / (1024 * 1024):.1f} MB" if stat.st_size >= 1024 * 1024 else f"{stat.st_size / 1024:.1f} KB"
            created_date = datetime.fromtimestamp(stat.st_mtime).strftime("%b %d, %Y %H:%M")
            files.append({
                "filename": f,
                "title": f.replace("_", " ").title().replace(".Pdf", "").replace(".Xlsx", ""),
                "format": "PDF" if f.endswith(".pdf") else "Excel",
                "date": created_date,
                "size": size_mb,
                "mtime": stat.st_mtime
            })
    # Sort newest generated reports first
    files.sort(key=lambda x: x["mtime"], reverse=True)
    return files

@app.post("/api/reports/generate")
def generate_report(request: GenerateReportRequest, db: Session = Depends(get_db), current_user: Optional[models.User] = Depends(get_current_user_optional)):
    filename = create_domain_report(request.report_type, request.file_format)
    user_name = current_user.name if (current_user and hasattr(current_user, 'name')) else "System"
    log_audit(db, action="REPORT_GENERATED", resource="REPORTING", details=f"Generated {filename}", user_name=user_name)
    return {
        "status": "success",
        "filename": filename,
        "message": f"Report '{filename}' successfully generated from live enterprise records."
    }

@app.get("/api/reports/download/{filename}")
def download_report(filename: str):
    ensure_reports_dir()
    filepath = os.path.join(REPORTS_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Requested report file not found on server")
    
    media_type = "application/pdf" if filename.endswith(".pdf") else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    return FileResponse(filepath, media_type=media_type, filename=filename)

# -------------------------------------------------------------
# Admin & Audit Trail Endpoints
# -------------------------------------------------------------
@app.get("/api/admin/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(100).all()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S") if l.timestamp else "N/A",
            "user": l.user_name,
            "action": l.action,
            "resource": l.resource,
            "details": l.details,
            "status": l.status
        }
        for l in logs
    ]

@app.get("/api/admin/users")
def get_admin_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "department": u.department,
            "status": "Active" if u.is_active else "Inactive",
            "joined": u.created_at.strftime("%b %Y") if u.created_at else "N/A"
        }
        for u in users
    ]

@app.get("/api/admin/roles")
def get_roles():
    return [
        {"role": "admin", "description": "Full administrative access across all agents, audit logs, and settings", "user_count": 1},
        {"role": "hr", "description": "Access to HR Agent, employee records, leave approvals, and workforce reports", "user_count": 1},
        {"role": "sales", "description": "Access to Sales Agent, order processing, pricing playbooks, and revenue forecasts", "user_count": 1},
        {"role": "support", "description": "Access to Support Agent, ticket triage queue, SLA metrics, and customer escalation", "user_count": 1},
        {"role": "employee", "description": "Standard portal access for leave balance queries, knowledge search, and help desk", "user_count": 21},
    ]

@app.get("/api/admin/permissions")
def get_permissions():
    return [
        {"permission": "query_hr_policy", "admin": True, "hr": True, "sales": False, "support": False, "employee": True},
        {"permission": "apply_leave", "admin": True, "hr": True, "sales": False, "support": False, "employee": True},
        {"permission": "approve_leave", "admin": True, "hr": True, "sales": False, "support": False, "employee": False},
        {"permission": "create_sales_order", "admin": True, "hr": False, "sales": True, "support": False, "employee": False},
        {"permission": "view_revenue_reports", "admin": True, "hr": False, "sales": True, "support": False, "employee": False},
        {"permission": "triage_support_tickets", "admin": True, "hr": False, "sales": False, "support": True, "employee": False},
        {"permission": "manage_knowledge_docs", "admin": True, "hr": True, "sales": True, "support": True, "employee": False},
        {"permission": "view_audit_trail", "admin": True, "hr": False, "sales": False, "support": False, "employee": False},
    ]

# -------------------------------------------------------------
# Departmental Statistics Endpoints
# -------------------------------------------------------------
@app.get("/api/hr/stats")
def get_hr_stats(db: Session = Depends(get_db)):
    active_employees = db.query(models.Employee).filter(models.Employee.is_active == True).count()
    pending_leaves = db.query(models.LeaveRequest).filter(models.LeaveRequest.status == "Pending").count()
    return {
        "active_employees": active_employees,
        "pending_leaves": pending_leaves,
        "compliance_issues": 0
    }

@app.get("/api/sales/stats")
def get_sales_stats(db: Session = Depends(get_db)):
    orders = db.query(models.Order).all()
    completed = [o for o in orders if o.status == "Completed"]
    total_rev = sum(o.total_price for o in completed)
    return {
        "quarterly_revenue": total_rev,
        "win_rate": 68,
        "active_opportunities": len(orders),
        "recent_orders": [
            {
                "id": o.id,
                "customer_id": o.customer_id,
                "amount": o.total_price,
                "status": o.status
            }
            for o in completed[-5:]
        ]
    }

@app.get("/api/support/stats")
def get_support_stats(db: Session = Depends(get_db)):
    tickets = db.query(models.SupportTicket).all()
    unresolved = sum(1 for t in tickets if t.status in ["Open", "In Progress", "Escalated"])
    high_priority = sum(1 for t in tickets if getattr(t, "priority", "Medium") in ["High", "Critical"])
    sla_risk = sum(1 for t in tickets if t.status == "Escalated")
    resolved = sum(1 for t in tickets if t.status == "Closed")
    
    return {
        "unresolved": unresolved,
        "high_priority": high_priority,
        "sla_risk": sla_risk,
        "resolved": resolved,
        "recent_tickets": [
            {
                "id": f"TCK-{t.id:04d}",
                "title": t.subject,
                "status": t.status,
                "priority": getattr(t, "priority", "Medium")
            }
            for t in tickets[-5:]
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
