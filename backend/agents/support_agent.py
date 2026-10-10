from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from database import SessionLocal
import models
from vector_store import get_qdrant_client
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from .state import AgentState
from .tools.reporting import generate_pdf_report

@tool
def get_ticket_status(ticket_id: int) -> str:
    """Gets the status of a specific customer support ticket."""
    db = SessionLocal()
    try:
        ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
        if ticket:
            return f"Ticket #{ticket.id} ('{ticket.subject}') status is: {ticket.status}"
        return f"Ticket #{ticket_id} not found."
    finally:
        db.close()

@tool
def query_support_sop(query: str) -> str:
    """Queries the Customer Support Standard Operating Procedures (SOP) for rules on refunds, SLAs, and troubleshooting."""
    client = get_qdrant_client()
    embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
    vec = embeddings.embed_query(query)
    
    results = client.search(
        collection_name="enterprise_docs",
        query_vector=vec,
        limit=2,
        query_filter={"must": [{"key": "source", "match": {"value": "support_sop.md"}}]}
    )
    if results:
        context = "\n\n".join([hit.payload["text"] for hit in results])
        return f"Found the following SOP info:\n{context}"
    return "No specific support SOP info found for that query."

from langgraph.prebuilt import create_react_agent

def process_support_query(state: AgentState):
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)
    tools = [get_ticket_status, query_support_sop, generate_pdf_report]
    
    agent = create_react_agent(llm, tools)
    messages = state["messages"]
    sys_msg = {"role": "system", "content": "You are a helpful Customer Support assistant. Use tools to fetch ticket statuses and SOP rules. You can also generate PDF reports."}
    
    result = agent.invoke({"messages": [sys_msg] + messages})
    
    new_messages = result["messages"][1 + len(messages):]
    
    return {"messages": new_messages}
