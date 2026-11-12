import os
import re
import shutil
from datetime import datetime, timedelta
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from database import SessionLocal
import models
from audit import log_audit
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from vector_store import get_qdrant_client, get_embedding_vector
from .state import AgentState
from .tools.reporting import generate_pdf_report, REPORTS_DIR, ensure_reports_dir
from langgraph.prebuilt import create_react_agent

@tool
def check_leave_balance(employee_id: int) -> str:
    """Checks the remaining leave balance for a given employee ID."""
    db = SessionLocal()
    try:
        emp = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
        if emp:
            log_audit(db, action="CHECK_LEAVE", resource="HR_AGENT", details=f"Checked leave for emp #{employee_id}")
            return f"Employee {employee_id} ({emp.name}, {emp.department}) has {emp.leave_balance} days of paid leave remaining."
        return f"Employee ID {employee_id} was not found in the organizational records."
    finally:
        db.close()

@tool
def apply_leave_request(employee_id: int, days: int, reason: str) -> str:
    """Applies for leave on behalf of an employee. If days > 3, triggers Human-in-the-Loop review and stores pending leave record."""
    db = SessionLocal()
    try:
        emp = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
        if not emp:
            return f"Error: Employee ID {employee_id} does not exist."
        
        if emp.leave_balance < days:
            return f"Cannot apply: Employee only has {emp.leave_balance} days remaining, but requested {days} days."

        start_date = datetime.now() + timedelta(days=2)
        end_date = start_date + timedelta(days=days)

        # Human-in-the-loop requirement for extended leaves (> 3 days)
        if days > 3:
            approval = models.ApprovalRequest(
                title=f"Extended Leave Request ({days} days) - {emp.name}",
                description=f"Reason: {reason}. Duration: {days} days from {start_date.strftime('%Y-%m-%d')}.",
                category="HR",
                requested_by_agent="HR Agent",
                impact=f"{days} Days Leave",
                confidence=95,
                status="Pending"
            )
            db.add(approval)

            # Record in LeaveRequest ledger as Pending Approval so it is part of leave history
            req = models.LeaveRequest(
                employee_id=employee_id,
                start_date=start_date,
                end_date=end_date,
                reason=reason,
                status="Pending Approval"
            )
            db.add(req)
            db.commit()
            db.refresh(approval)
            db.refresh(req)
            log_audit(db, action="LEAVE_APPROVAL_TRIGGERED", resource="HITL_APPROVAL", details=f"Approval #{approval.id} created for {emp.name} (Request #{req.id})")
            return (
                f"Your leave request for {days} days ('{reason}') has been submitted and recorded (Request #{req.id}). "
                f"Since the duration exceeds 3 days, a Human-in-the-Loop review has been triggered for manager authorization "
                f"(Approval #{approval.id}). It is now in the pending approvals queue."
            )
        
        # Immediate approval for short leaves (<= 3 days)
        emp.leave_balance -= days
        req = models.LeaveRequest(
            employee_id=employee_id,
            start_date=start_date,
            end_date=end_date,
            reason=reason,
            status="Approved"
        )
        db.add(req)
        db.commit()
        db.refresh(req)
        log_audit(db, action="LEAVE_APPROVED_AUTO", resource="HR_AGENT", details=f"Auto-approved {days} days for {emp.name}")
        return f"Leave request for {days} days ('{reason}') has been approved successfully (Request #{req.id})! New balance: {emp.leave_balance} days remaining."
    finally:
        db.close()

@tool
def get_leave_history(employee_id: int) -> str:
    """Retrieves all previously applied leave requests, dates, reasons, durations, and approval statuses for a given employee ID."""
    db = SessionLocal()
    try:
        emp = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
        if not emp:
            return f"Employee ID {employee_id} was not found in organizational records."
            
        # Fetch leaves from LeaveRequest table
        leave_reqs = db.query(models.LeaveRequest).filter(models.LeaveRequest.employee_id == employee_id).order_by(models.LeaveRequest.id.desc()).all()
        
        # Also check approvals
        approvals = db.query(models.ApprovalRequest).filter(
            models.ApprovalRequest.category == "HR"
        ).filter(
            (models.ApprovalRequest.title.ilike(f"%{emp.name}%")) | 
            (models.ApprovalRequest.description.ilike(f"%Employee {emp.id}%")) |
            (models.ApprovalRequest.description.ilike(f"%Employee #{emp.id}%")) |
            (models.ApprovalRequest.title.ilike(f"%Employee {emp.id}%"))
        ).order_by(models.ApprovalRequest.id.desc()).all()
        
        if not leave_reqs and not approvals:
            return f"Employee {emp.name} (ID: #{employee_id}, {emp.department}) has no previously applied leave requests. Current remaining paid leave balance: {emp.leave_balance} days."
            
        lines = [
            f"Leave History & Records for {emp.name} (Employee ID #{employee_id}, {emp.department}):",
            f"- Current Remaining Leave Balance: {emp.leave_balance} Days",
            f"- Total Leave Records Found: {len(leave_reqs) + len(approvals)}"
        ]
        
        if leave_reqs:
            lines.append("\nPreviously Applied Leave Requests:")
            for l in leave_reqs:
                start_str = l.start_date.strftime("%b %d, %Y") if l.start_date else "N/A"
                end_str = l.end_date.strftime("%b %d, %Y") if l.end_date else "N/A"
                days = (l.end_date - l.start_date).days if (l.start_date and l.end_date) else 1
                lines.append(f"  • Request #{l.id}: {days} Day(s) ({start_str} to {end_str}) | Reason: '{l.reason}' | Status: [{l.status}]")
                
        if approvals:
            lines.append("\nExtended Leave Manager Approval Queue (HITL):")
            for a in approvals:
                lines.append(f"  • Approval #{a.id}: {a.title} | Status: [{a.status}] | Details: {a.description}")
                
        log_audit(db, action="CHECK_LEAVE_HISTORY", resource="HR_AGENT", details=f"Retrieved leave history for {emp.name} (ID #{employee_id})")
        return "\n".join(lines)
    finally:
        db.close()

@tool
def generate_employee_leave_report(employee_id: int) -> str:
    """Generates an official enterprise PDF report summarizing all previously applied leave requests, approval decisions, dates, and balance for an employee. Returns the file path and download URL."""
    db = SessionLocal()
    try:
        emp = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
        if not emp:
            return f"Error: Employee ID {employee_id} does not exist."
            
        leave_reqs = db.query(models.LeaveRequest).filter(models.LeaveRequest.employee_id == employee_id).order_by(models.LeaveRequest.id.desc()).all()
        approvals = db.query(models.ApprovalRequest).filter(
            models.ApprovalRequest.category == "HR"
        ).filter(
            (models.ApprovalRequest.title.ilike(f"%{emp.name}%")) | 
            (models.ApprovalRequest.description.ilike(f"%Employee {emp.id}%")) |
            (models.ApprovalRequest.description.ilike(f"%Employee #{emp.id}%")) |
            (models.ApprovalRequest.title.ilike(f"%Employee {emp.id}%"))
        ).order_by(models.ApprovalRequest.id.desc()).all()
        
        timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"leave_report_employee_{employee_id}_{timestamp_str}.pdf"
        static_filename = f"leave_report_employee_{employee_id}.pdf"
        
        content_lines = [
            f"Employee Name: {emp.name}",
            f"Employee ID: #{emp.id}",
            f"Department: {emp.department}",
            f"Work Email: {emp.email}",
            f"Current Paid Leave Balance: {emp.leave_balance} Days Remaining",
            f"Total Recorded Leave Applications: {len(leave_reqs)}",
            f"Employment Status: {'Active' if emp.is_active else 'Inactive'}"
        ]
        
        if leave_reqs:
            content_lines.append("--- PREVIOUSLY APPLIED LEAVE APPLICATIONS ---")
            for l in leave_reqs:
                start_str = l.start_date.strftime("%Y-%m-%d") if l.start_date else "N/A"
                end_str = l.end_date.strftime("%Y-%m-%d") if l.end_date else "N/A"
                days = (l.end_date - l.start_date).days if (l.start_date and l.end_date) else 1
                content_lines.append(f"Request #{l.id} ({days} Days: {start_str} to {end_str}): {l.status} - Reason: {l.reason}")
                
        if approvals:
            content_lines.append("--- EXTENDED LEAVE HITL APPROVALS ---")
            for a in approvals:
                content_lines.append(f"Approval #{a.id} ({a.status}): {a.description}")
                
        generate_pdf_report.invoke({
            "title": f"Leave History & Attendance Audit - {emp.name}",
            "content_lines": content_lines,
            "filename": filename
        })

        # Also write/copy to static name so direct links always stay valid
        try:
            ensure_reports_dir()
            ts_path = os.path.join(REPORTS_DIR, filename)
            st_path = os.path.join(REPORTS_DIR, static_filename)
            if os.path.exists(ts_path):
                shutil.copy2(ts_path, st_path)
        except Exception:
            pass
        
        download_url = f"http://localhost:8000/api/reports/download/{filename}"
        log_audit(db, action="EMPLOYEE_LEAVE_REPORT_GENERATED", resource="HR_AGENT", details=f"Generated PDF for emp #{employee_id}: {filename}")
        
        return (
            f"Official Leave History Report successfully compiled for {emp.name} (Employee ID #{employee_id})!\n"
            f"- Generated PDF File: {filename}\n"
            f"- Download URL: {download_url}\n"
            f"- Direct Link: [Download Official Leave Report PDF]({download_url})\n"
            f"- Total Leave Applications Included: {len(leave_reqs)}\n"
            f"- Current Remaining Balance: {emp.leave_balance} days\n"
            f"The report has been permanently archived in the Enterprise Reports registry."
        )
    finally:
        db.close()

@tool
def query_hr_policy(query: str) -> str:
    """Queries enterprise HR policy documents for official policies, leave guidelines, remote work, benefits, and conduct."""
    client = get_qdrant_client()
    vec = get_embedding_vector(query)
    
    q_filter = Filter(should=[
        FieldCondition(key="category", match=MatchValue(value="HR")),
        FieldCondition(key="source", match=MatchValue(value="hr_policy.md"))
    ])
    results = client.search(
        collection_name="enterprise_docs",
        query_vector=vec,
        limit=3,
        query_filter=q_filter
    )
    if results:
        context = "\n\n".join([hit.payload["text"] for hit in results])
        return f"Enterprise HR Policy Knowledge Base:\n{context}"
    return "No matching HR policy information found in the knowledge repository."

def parse_leave_application(messages):
    """
    Enforces the sequential leave application rule:
    Question 1: Employee ID
    Question 2: Number of Days
    Question 3: Reason
    
    The next question is only asked after completing the answer for the previous question.
    """
    history_texts = []
    for m in messages:
        if isinstance(m, dict):
            history_texts.append(m.get('content', ''))
        else:
            history_texts.append(getattr(m, 'content', ''))
            
    full_text = ' '.join(history_texts).lower()
    
    # Check if this is an inquiry about past leaves, report generation, balance, or policy
    if any(k in full_text for k in ['report', 'reports', 'history', 'previous leaves', 'past leaves', 'leave balance', 'remaining balance', 'policy']):
        if not any(k in full_text for k in ['apply for', 'apply leave', 'take leave', 'request leave']):
            return None

    # Check if user wants to apply for leave or is in an active leave application flow
    is_apply = any(k in full_text for k in [
        'apply', 'take leave', 'request leave', 'book leave', 'need leave', 'want leave', 'on leave',
        'applying for leave', 'vacation leave', 'sick leave', 'medical leave'
    ])
    if not is_apply:
        for m in messages:
            txt = (m.get('content', '') if isinstance(m, dict) else getattr(m, 'content', '')).lower()
            if 'employee id' in txt or 'days of leave' in txt or 'reason for your leave' in txt:
                is_apply = True
                break

    if not is_apply:
        return None

    # Get the latest user message
    last_user_text = ''
    for m in reversed(messages):
        role = m.get('role', '') if isinstance(m, dict) else getattr(m, 'type', '')
        if role in ['human', 'user']:
            last_user_text = (m.get('content', '') if isinstance(m, dict) else getattr(m, 'content', '')).strip()
            break

    emp_id = None
    days = None

    # Turn-by-turn conversational analysis
    for i in range(len(messages) - 1):
        curr_msg = messages[i]
        next_msg = messages[i+1]
        curr_text = (curr_msg.get('content', '') if isinstance(curr_msg, dict) else getattr(curr_msg, 'content', '')).lower()
        next_text = (next_msg.get('content', '') if isinstance(next_msg, dict) else getattr(next_msg, 'content', '')).strip()
        
        # Check if assistant asked for employee ID
        if ('provide your' in curr_text or 'enter your' in curr_text or 'what is your' in curr_text) and 'employee id' in curr_text:
            m_num = re.search(r'\b(\d+)\b', next_text)
            if m_num:
                emp_id = int(m_num.group(1))
        # Check if assistant asked for number of days
        elif 'how many days' in curr_text or 'number of leave days' in curr_text or 'days of leave would you like' in curr_text:
            m_num = re.search(r'\b(\d+)\b', next_text)
            if m_num:
                days = int(m_num.group(1))

    # Also extract explicit patterns across all messages
    for m in messages:
        txt = (m.get('content', '') if isinstance(m, dict) else getattr(m, 'content', '')).lower()
        m_e = re.findall(r'(?:employee|emp)\s*(?:id)?\s*[#:=]?\s*(\d+)', txt)
        if m_e:
            emp_id = int(m_e[-1])
        m_d = re.findall(r'\b(\d+)\s*(?:days?|day)\b', txt)
        if m_d:
            days = int(m_d[-1])

    # Check standalone number in last message if still missing
    if emp_id is None and re.fullmatch(r'\d+', last_user_text):
        for m in reversed(messages[:-1]):
            c = (m.get('content', '') if isinstance(m, dict) else getattr(m, 'content', '')).lower()
            if 'employee id' in c or 'your id' in c:
                emp_id = int(last_user_text)
                break

    # 3. Extract reason
    reason = None
    reason_keywords = [
        'vacation', 'annual leave', 'family function', 'marriage', 'wedding',
        'sick', 'seak', 'seek', 'medical', 'fever', 'doctor', 'hospital', 'illness',
        'personal', 'casual', 'emergency', 'holiday', 'trip', 'travel',
        'maternity', 'paternity', 'bereavement', 'rest', 'burnout'
    ]
    for rk in reason_keywords:
        if rk in full_text:
            reason = 'Sick leave' if rk in ['sick', 'seak', 'seek', 'medical', 'fever', 'illness', 'doctor', 'hospital'] else rk.capitalize()
            break

    m_reas = re.search(r'reason\s*(?:is|:)?\s*([a-zA-Z\s]{3,30})', full_text)
    if m_reas and not reason:
        reason = m_reas.group(1).strip().capitalize()

    return {
        'is_apply': True,
        'emp_id': emp_id,
        'days': days,
        'reason': reason
    }

def process_hr_query(state: AgentState):
    messages = state["messages"]

    # Check sequential leave application flow
    info = parse_leave_application(messages)
    if info and info['is_apply']:
        emp_id = info['emp_id']
        days = info['days']
        reason = info['reason']

        # Step 1: Employee ID must be answered first
        if emp_id is None:
            details = []
            if days:
                details.append(f"**{days} days**")
            if reason:
                details.append(f"Reason: **{reason}**")
            
            if details:
                joined_details = ", ".join(details)
                prefix = f"I have noted your leave details ({joined_details}). "
            else:
                prefix = ""
            return {"messages": [AIMessage(content=f"{prefix}Could you please provide your **Employee ID**?")]}

        # Step 2: Once Employee ID is answered, confirm days
        if days is None:
            prefix = f"Employee ID #{emp_id} confirmed. " if emp_id else ""
            return {"messages": [AIMessage(content=f"{prefix}How many days of leave would you like to apply for?")]}

        # Step 3: Once Employee ID and days are answered, confirm reason
        if not reason:
            return {"messages": [AIMessage(content=f"Employee ID #{emp_id} for **{days} days** noted. What is the reason for your leave (e.g., vacation, medical, family function)?")]}

        # Step 4: All questions answered! Execute apply_leave_request
        try:
            result_str = apply_leave_request.invoke({
                "employee_id": emp_id,
                "days": days,
                "reason": reason
            })
            return {"messages": [AIMessage(content=result_str)]}
        except Exception as e:
            return {"messages": [AIMessage(content=f"Leave application failed: {str(e)}")]}

    # Extract last user query
    last_user_query = ""
    for m in reversed(messages):
        role = m.get('role', '') if isinstance(m, dict) else getattr(m, 'type', '')
        if role in ['human', 'user']:
            last_user_query = (m.get('content', '') if isinstance(m, dict) else getattr(m, 'content', '')).strip()
            break

    q_low = last_user_query.lower()

    # 1. Direct Leave Report generation (e.g. 'Generate a PDF leave report for employee 2', 'give me the reports of the applied leave for employee id 1')
    if any(k in q_low for k in ['report', 'reports', 'pdf']) and any(k in q_low for k in ['generate', 'give me', 'create', 'download', 'applied', 'leave']):
        m_id = re.search(r'(?:employee|emp|id|#)\s*[:=]?\s*(\d+)', q_low)
        if m_id:
            emp_id = int(m_id.group(1))
            try:
                hist_str = get_leave_history.invoke({"employee_id": emp_id})
                rep_str = generate_employee_leave_report.invoke({"employee_id": emp_id})
                return {"messages": [AIMessage(content=f"{hist_str}\n\n{rep_str}")]}
            except Exception:
                pass

    # 2. Direct Leave balance query (e.g. 'Check leave balance for employee 1')
    if any(k in q_low for k in ['balance', 'how many days']) and 'leave' in q_low:
        m_id = re.search(r'(?:employee|emp|id|#)\s*[:=]?\s*(\d+)', q_low)
        if m_id:
            emp_id = int(m_id.group(1))
            try:
                res = check_leave_balance.invoke({"employee_id": emp_id})
                return {"messages": [AIMessage(content=res)]}
            except Exception:
                pass

    # 3. Direct Leave history query (e.g. 'Show leave history for employee 2')
    if any(k in q_low for k in ['history', 'previous leaves', 'past leaves', 'applied leaves']) and 'leave' in q_low:
        m_id = re.search(r'(?:employee|emp|id|#)\s*[:=]?\s*(\d+)', q_low)
        if m_id:
            emp_id = int(m_id.group(1))
            try:
                res = get_leave_history.invoke({"employee_id": emp_id})
                return {"messages": [AIMessage(content=res)]}
            except Exception:
                pass

    # Standard HR ReAct workflow for policies, complex questions, etc.
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=700)
    tools = [
        check_leave_balance, 
        apply_leave_request, 
        get_leave_history, 
        generate_employee_leave_report, 
        query_hr_policy, 
        generate_pdf_report
    ]
    
    agent = create_react_agent(llm, tools)
    
    sys_msg = {
        "role": "system",
        "content": (
            "You are the Enterprise HR Agent. You can inspect leave balances, apply leave requests, "
            "retrieve complete leave history/previously applied leaves, generate official employee leave PDF reports, "
            "and consult company HR policies.\n\n"
            "LEAVE HISTORY & PREVIOUSLY APPLIED LEAVES INQUIRIES:\n"
            "- When the user asks for previously applied leaves, leave history, leave records, or says 'give me the reports of the applied leave for employee id X' (even with typos like 'app;lied leave', 'aplied', 'past leaves', 'show previous leaves'):\n"
            "  1. Extract the Employee ID (from the current prompt, or from previous turns in the conversation history where an employee ID was mentioned). If Employee ID is completely unknown, ask for it.\n"
            "  2. ALWAYS call 'get_leave_history' with that employee_id to retrieve all previously applied leave records and approvals.\n"
            "  3. If the user mentions 'reports', 'report', 'generate', 'pdf', or 'export' (e.g. 'give me the reports of the applied leave', 'generate leave report', 'export PDF', 'generate the report'):\n"
            "     -> ALSO call 'generate_employee_leave_report' with that employee_id to compile the official downloadable PDF report!\n"
            "  4. In your final response:\n"
            "     - Present the detailed list of previously applied leaves (dates, days, reasons, and statuses: Approved, Pending Approval, or Rejected).\n"
            "     - Mention current remaining leave balance.\n"
            "     - Provide the direct download link clearly: '[Download Official Leave Report PDF](http://localhost:8000/api/reports/download/leave_report_employee_X.pdf)'.\n\n"
            "CONVERSATIONAL MEMORY RULE:\n"
            "- Always inspect prior conversation turns carefully: if an Employee ID was provided earlier (e.g. when applying for leave), remember it! Do not ask the user for their Employee ID again.\n"
            "- Tolerate all user typos (e.g. 'app;lied' -> applied, 'reprot' -> report, 'seak' -> sick).\n\n"
            "CRITICAL INSTRUCTION — NEVER HALLUCINATE OR GUESS EMPLOYEE ID:\n"
            "- If Employee ID is not provided by the user, you MUST ask for it. Do NOT guess or call tools without it."
        )
    }
    
    try:
        result = agent.invoke({"messages": [sys_msg] + messages})
        new_messages = result["messages"][1 + len(messages):]
        return {"messages": new_messages}
    except Exception as e:
        err_msg = str(e)
        # Self-healing recovery for Groq tool schema errors:
        if "generate_employee_leave_report" in err_msg or "report" in q_low:
            m_id = re.search(r'\b(\d+)\b', last_user_query) or re.search(r'\b(\d+)\b', err_msg)
            if m_id:
                emp_id = int(m_id.group(1))
                try:
                    res = generate_employee_leave_report.invoke({"employee_id": emp_id})
                    return {"messages": [AIMessage(content=res)]}
                except Exception:
                    pass
        elif "check_leave_balance" in err_msg or "balance" in q_low:
            m_id = re.search(r'\b(\d+)\b', last_user_query) or re.search(r'\b(\d+)\b', err_msg)
            if m_id:
                emp_id = int(m_id.group(1))
                try:
                    res = check_leave_balance.invoke({"employee_id": emp_id})
                    return {"messages": [AIMessage(content=res)]}
                except Exception:
                    pass
        elif "get_leave_history" in err_msg or "history" in q_low:
            m_id = re.search(r'\b(\d+)\b', last_user_query) or re.search(r'\b(\d+)\b', err_msg)
            if m_id:
                emp_id = int(m_id.group(1))
                try:
                    res = get_leave_history.invoke({"employee_id": emp_id})
                    return {"messages": [AIMessage(content=res)]}
                except Exception:
                    pass

        return {"messages": [AIMessage(content=f"Could you please confirm your Employee ID so I can process your request?")]}
