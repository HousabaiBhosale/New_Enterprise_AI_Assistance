from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from database import SessionLocal
import models
from vector_store import get_qdrant_client
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from .state import AgentState

@tool
def check_leave_balance(employee_id: int) -> str:
    """Checks the leave balance for a given employee ID."""
    db = SessionLocal()
    try:
        emp = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
        if emp:
            return f"Employee {employee_id} ({emp.name}) has {emp.leave_balance} days of leave remaining."
        return f"Employee ID {employee_id} not found."
    finally:
        db.close()

@tool
def query_hr_policy(query: str) -> str:
    """Queries the HR policy documents for answers about rules, leave policies, code of conduct, remote work etc."""
    client = get_qdrant_client()
    embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
    vec = embeddings.embed_query(query)
    
    results = client.search(
        collection_name="enterprise_docs",
        query_vector=vec,
        limit=2,
        query_filter={"must": [{"key": "source", "match": {"value": "hr_policy.md"}}]}
    )
    if results:
        context = "\n\n".join([hit.payload["text"] for hit in results])
        return f"Found the following policy info:\n{context}"
    return "No specific HR policy found for that query."

# Add reporting tool as well so HR can generate reports
from .tools.reporting import generate_pdf_report

from langgraph.prebuilt import create_react_agent

def process_hr_query(state: AgentState):
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)
    tools = [check_leave_balance, query_hr_policy, generate_pdf_report]
    
    agent = create_react_agent(llm, tools)
    messages = state["messages"]
    
    sys_msg = {"role": "system", "content": "You are a helpful HR assistant. Use tools to fetch policies and leave balances. If asked to generate a report, use the pdf tool."}
    
    result = agent.invoke({"messages": [sys_msg] + messages})
    
    new_messages = result["messages"][1 + len(messages):]
    
    return {"messages": new_messages}
