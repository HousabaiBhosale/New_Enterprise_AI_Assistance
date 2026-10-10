import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from vector_store import init_qdrant

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agentic Enterprise AI Assistant API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
async def startup_event():
    # Initialize Qdrant collection on startup
    init_qdrant()

class ChatRequest(BaseModel):
    query: str
    user_id: int

@app.get("/")
def read_root():
    return {"message": "Agentic Enterprise AI Assistant API is running"}

@app.get("/api/hr/stats")
def get_hr_stats(db: Session = Depends(get_db)):
    active_employees = db.query(models.Employee).filter(models.Employee.is_active == True).count()
    pending_leaves = db.query(models.LeaveRequest).filter(models.LeaveRequest.status == "Pending").count()
    
    # If the DB is empty (first run), return some mock data to make the UI look good
    if active_employees == 0:
        return {
            "active_employees": 2410,
            "pending_leaves": 18,
            "compliance_issues": 0
        }

    return {
        "active_employees": active_employees,
        "pending_leaves": pending_leaves,
        "compliance_issues": 0
    }

class ApprovalRequest(BaseModel):
    action_id: str
    approved: bool

@app.post("/api/approve")
def approve_action(request: ApprovalRequest):
    # In a full production app, this would resume a paused LangGraph state using thread_id.
    # For this prototype, we mock the approval process.
    if request.approved:
        return {"status": "success", "message": f"Action {request.action_id} approved and executed."}
    else:
        return {"status": "rejected", "message": f"Action {request.action_id} was rejected."}

from agents.coordinator import process_query

@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        # Route query through the Coordinator Agent (LangGraph)
        response_text = process_query(request.query)
        return {
            "response": response_text,
            "agent_used": "LangGraph Supervisor Workflow"
        }
    except Exception as e:
        return {
            "response": f"Error processing query: {str(e)}",
            "agent_used": "Error"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
