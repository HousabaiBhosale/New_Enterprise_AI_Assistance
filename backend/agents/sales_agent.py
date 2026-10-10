from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from langchain_groq import ChatGroq
from database import SessionLocal
import models
from vector_store import get_qdrant_client
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from .state import AgentState
from .tools.reporting import generate_pdf_report, generate_excel_report

@tool
def get_sales_revenue() -> str:
    """Gets the total sales revenue from all completed orders."""
    db = SessionLocal()
    try:
        orders = db.query(models.Order).filter(models.Order.status == "Completed").all()
        total = sum(order.total_price for order in orders)
        return f"Total Sales Revenue from completed orders: ${total:.2f}"
    finally:
        db.close()

@tool
def query_sales_playbook(query: str) -> str:
    """Queries the sales playbook for rules on discounts, product pricing, and lead qualification."""
    client = get_qdrant_client()
    embeddings = FastEmbedEmbeddings(model_name="BAAI/bge-small-en-v1.5")
    vec = embeddings.embed_query(query)
    
    results = client.search(
        collection_name="enterprise_docs",
        query_vector=vec,
        limit=2,
        query_filter={"must": [{"key": "source", "match": {"value": "sales_playbook.md"}}]}
    )
    if results:
        context = "\n\n".join([hit.payload["text"] for hit in results])
        return f"Found the following playbook info:\n{context}"
    return "No specific sales playbook info found for that query."

from langgraph.prebuilt import create_react_agent

def process_sales_query(state: AgentState):
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)
    tools = [get_sales_revenue, query_sales_playbook, generate_pdf_report, generate_excel_report]
    
    agent = create_react_agent(llm, tools)
    messages = state["messages"]
    sys_msg = {"role": "system", "content": "You are a helpful Sales assistant. Use tools to fetch pricing, playbook info, and revenue. You can generate reports if requested."}
    
    result = agent.invoke({"messages": [sys_msg] + messages})
    
    new_messages = result["messages"][1 + len(messages):]
    
    return {"messages": new_messages}
