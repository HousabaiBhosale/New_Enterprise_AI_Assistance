from datetime import datetime
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from database import SessionLocal
import models
from audit import log_audit
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
from vector_store import get_qdrant_client, get_embedding_vector
from .state import AgentState
from .tools.reporting import generate_pdf_report
from langgraph.prebuilt import create_react_agent

@tool
def get_ticket_status(ticket_id: int) -> str:
    """Retrieves current triage status, subject, and details for a customer helpdesk ticket."""
    db = SessionLocal()
    try:
        ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
        if ticket:
            priority = getattr(ticket, 'priority', 'Standard')
            log_audit(db, action="CHECK_TICKET", resource="SUPPORT_AGENT", details=f"Checked helpdesk ticket #{ticket_id}")
            return f"Helpdesk Ticket #{ticket.id} ('{ticket.subject}') - Status: [{ticket.status}], Priority: [{priority}]."
        return f"Helpdesk Ticket #{ticket_id} was not found."
    finally:
        db.close()

@tool
def get_customer_tickets(customer_id: int) -> str:
    """Retrieves all previous support tickets, subjects, triage statuses, priorities, and creation dates for a customer ID."""
    db = SessionLocal()
    try:
        tickets = db.query(models.SupportTicket).filter(models.SupportTicket.customer_id == customer_id).order_by(models.SupportTicket.id.desc()).all()
        if not tickets:
            return f"No helpdesk support tickets found for Customer #{customer_id}."
            
        lines = [
            f"Support Incident History for Customer #{customer_id}:",
            f"- Total Logged Incidents: {len(tickets)}"
        ]
        for t in tickets:
            created_str = t.created_at.strftime("%b %d, %Y") if t.created_at else "N/A"
            priority = getattr(t, 'priority', 'Medium')
            lines.append(f"  • Ticket #{t.id}: '{t.subject}' | Priority: [{priority}] | Status: [{t.status}] logged on {created_str}")
            
        log_audit(db, action="QUERY_CUSTOMER_TICKETS", resource="SUPPORT_AGENT", details=f"Retrieved {len(tickets)} tickets for Customer #{customer_id}")
        return "\n".join(lines)
    finally:
        db.close()

@tool
def create_support_ticket(customer_id: int, subject: str, description: str, priority: str = "Medium") -> str:
    """Creates a new customer helpdesk ticket in the triage system."""
    db = SessionLocal()
    try:
        ticket = models.SupportTicket(
            customer_id=customer_id,
            subject=subject,
            description=description,
            priority=priority,
            status="Open"
        )
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        log_audit(db, action="CREATE_TICKET", resource="SUPPORT_AGENT", details=f"Helpdesk ticket #{ticket.id} created for Customer {customer_id}")
        return f"Helpdesk Ticket #{ticket.id} successfully created for Customer #{customer_id} ('{subject}') with status [Open]."
    finally:
        db.close()

@tool
def escalate_ticket_to_human(ticket_id: int, reason: str) -> str:
    """Escalates a helpdesk ticket to human operators when the issue is sensitive or beyond automated resolution."""
    db = SessionLocal()
    try:
        ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
        if not ticket:
            return f"Helpdesk Ticket #{ticket_id} not found."
            
        ticket.status = "Escalated"
        approval = models.ApprovalRequest(
            title=f"Helpdesk Escalation: Ticket #{ticket.id} ({ticket.subject})",
            description=f"Escalation Reason: {reason}. Customer ID: {ticket.customer_id}",
            category="Support",
            requested_by_agent="Helpdesk & Support Agent",
            impact="Customer Escalation",
            confidence=88,
            status="Pending"
        )
        db.add(approval)
        db.commit()
        log_audit(db, action="TICKET_ESCALATED", resource="HITL_APPROVAL", details=f"Escalated helpdesk ticket #{ticket_id}: {reason}")
        return f"Helpdesk Ticket #{ticket.id} has been marked as [Escalated] and forwarded to the Human Triage Team (Approval #{approval.id})."
    finally:
        db.close()

@tool
def query_support_sop(query: str) -> str:
    """Searches Customer Support Standard Operating Procedures (SOP) for SLAs, refund rules, escalation paths, and troubleshooting."""
    client = get_qdrant_client()
    vec = get_embedding_vector(query)
    
    q_filter = Filter(should=[
        FieldCondition(key="category", match=MatchValue(value="Support")),
        FieldCondition(key="source", match=MatchValue(value="support_sop.md"))
    ])
    results = client.search(
        collection_name="enterprise_docs",
        query_vector=vec,
        limit=3,
        query_filter=q_filter
    )
    if results:
        context = "\n\n".join([hit.payload["text"] for hit in results])
        return f"Helpdesk Support SOP Knowledge Base:\n{context}"
    return "No matching support SOP documentation found."

def process_support_query(state: AgentState):
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)
    tools = [get_ticket_status, get_customer_tickets, create_support_ticket, escalate_ticket_to_human, query_support_sop, generate_pdf_report]
    
    agent = create_react_agent(llm, tools)
    messages = state["messages"]
    sys_msg = {
        "role": "system",
        "content": (
            "You are the Enterprise Helpdesk & Support Agent. You can inspect existing helpdesk tickets, retrieve previous tickets logged by a customer, "
            "create new helpdesk requests, escalate complex or sensitive issues for human intervention, query support SOPs for SLAs and refund policies, "
            "and generate official PDF resolution reports.\n\n"
            "TICKET HISTORY & PREVIOUS REQUESTS:\n"
            "- When the user asks for their previous tickets, support history, or tickets for a Customer ID, call 'get_customer_tickets' with the customer_id.\n\n"
            "CRITICAL INSTRUCTION — ONE QUESTION AT A TIME:\n"
            "When the user wants to create a helpdesk ticket or support request and some details are missing, you MUST ask for ONLY ONE piece of information at a time:\n"
            "1. If Customer ID is missing, ask ONLY: 'Could you please provide your Customer ID?'\n"
            "2. If Customer ID is known but the issue subject/title is missing, ask ONLY: 'What is the main subject or title of the issue?'\n"
            "3. If Customer ID and subject are known but details/description are missing, ask ONLY: 'Could you please provide a brief description of the problem?'\n"
            "4. Once Customer ID, subject, and description are all known, immediately call 'create_support_ticket'!\n\n"
            "Always inspect previous conversation turns so you remember what the user already provided.\n\n"
            "When asked to generate a report or summary PDF, you MUST invoke the 'generate_pdf_report' tool "
            "with an executive title, a list of structured 'Key: Value' summary lines, and a filename ending in '.pdf'. "
            "Never tell the user a report was created without calling 'generate_pdf_report'."
        )
    }
    
    try:
        result = agent.invoke({"messages": [sys_msg] + messages})
        new_messages = result["messages"][1 + len(messages):]
        return {"messages": new_messages}
    except Exception as e:
        return {"messages": [AIMessage(content=f"Could you please confirm your Customer ID, the subject of the issue, and a brief description so I can log your helpdesk ticket?")]}
