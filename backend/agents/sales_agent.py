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
from .tools.reporting import generate_pdf_report, generate_excel_report
from langgraph.prebuilt import create_react_agent

@tool
def get_sales_revenue() -> str:
    """Retrieves current aggregate sales revenue, order volumes, and average deal size from completed enterprise transactions."""
    db = SessionLocal()
    try:
        orders = db.query(models.Order).filter(models.Order.status == "Completed").all()
        total = sum(order.total_price for order in orders)
        count = len(orders)
        avg = total / count if count > 0 else 0
        log_audit(db, action="SALES_REVENUE_QUERY", resource="SALES_AGENT", details=f"Total: ${total:.2f}")
        return f"Total Sales Revenue: ${total:,.2f} across {count} completed transactions (Average deal: ${avg:,.2f})."
    finally:
        db.close()

@tool
def get_customer_orders(customer_id: int) -> str:
    """Retrieves all previous sales orders, products purchased, amounts, dates, and statuses for a customer ID."""
    db = SessionLocal()
    try:
        orders = db.query(models.Order).filter(models.Order.customer_id == customer_id).order_by(models.Order.id.desc()).all()
        if not orders:
            return f"No previous sales orders recorded for Customer #{customer_id}."
            
        total_spent = sum(o.total_price for o in orders if o.status == "Completed")
        lines = [
            f"Sales Order History for Customer #{customer_id}:",
            f"- Total Completed Spend: ${total_spent:,.2f}",
            f"- Total Orders: {len(orders)}"
        ]
        for o in orders:
            p_name = o.product.name if o.product else f"Product #{o.product_id}"
            d_str = o.order_date.strftime("%b %d, %Y") if o.order_date else "N/A"
            lines.append(f"  • Order #{o.id}: {o.quantity}x '{p_name}' - ${o.total_price:,.2f} | Status: [{o.status}] on {d_str}")
            
        log_audit(db, action="QUERY_CUSTOMER_ORDERS", resource="SALES_AGENT", details=f"Retrieved {len(orders)} orders for Customer #{customer_id}")
        return "\n".join(lines)
    finally:
        db.close()

@tool
def create_sales_order(customer_id: int, product_id: int, quantity: int) -> str:
    """Places a new customer sales order. Orders over $1,000 require Human-in-the-Loop authorization."""
    db = SessionLocal()
    try:
        product = db.query(models.Product).filter(models.Product.id == product_id).first()
        if not product:
            return f"Product ID {product_id} not found."
            
        total_price = product.price * quantity
        
        # Human approval trigger for high-value transactions
        if total_price > 1000.0:
            approval = models.ApprovalRequest(
                title=f"High-Value Order Authorization: Customer #{customer_id}",
                description=f"Order for {quantity}x '{product.name}' totalling ${total_price:,.2f} exceeds automatic approval threshold ($1,000).",
                category="Sales",
                requested_by_agent="Sales Agent",
                impact=f"${total_price:,.2f}",
                confidence=91,
                status="Pending"
            )
            db.add(approval)
            db.commit()
            db.refresh(approval)
            log_audit(db, action="HIGH_VALUE_ORDER_TRIGGERED", resource="HITL_APPROVAL", details=f"Approval #{approval.id} for ${total_price:.2f}")
            return f"Order created for {quantity}x {product.name} (${total_price:,.2f}), but requires Sales Director Human-in-the-Loop review (Approval #{approval.id}). Routed to approvals queue."

        order = models.Order(
            customer_id=customer_id,
            product_id=product_id,
            quantity=quantity,
            total_price=total_price,
            status="Completed"
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        log_audit(db, action="ORDER_COMPLETED", resource="SALES_AGENT", details=f"Order #{order.id} for Customer {customer_id}, total ${total_price}")
        return f"Order #{order.id} successfully recorded! {quantity}x '{product.name}' for Customer #{customer_id}. Total: ${total_price:,.2f}."
    finally:
        db.close()

@tool
def query_sales_playbook(query: str) -> str:
    """Searches the sales playbook for discount thresholds, pipeline stages, pricing tiers, and contract policies."""
    client = get_qdrant_client()
    vec = get_embedding_vector(query)
    
    q_filter = Filter(should=[
        FieldCondition(key="category", match=MatchValue(value="Sales")),
        FieldCondition(key="source", match=MatchValue(value="sales_playbook.md"))
    ])
    results = client.search(
        collection_name="enterprise_docs",
        query_vector=vec,
        limit=3,
        query_filter=q_filter
    )
    if results:
        context = "\n\n".join([hit.payload["text"] for hit in results])
        return f"Sales Playbook Guidelines:\n{context}"
    return "No matching sales playbook guidelines found in the knowledge repository."

def process_sales_query(state: AgentState):
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)
    tools = [get_sales_revenue, get_customer_orders, create_sales_order, query_sales_playbook, generate_pdf_report, generate_excel_report]
    
    agent = create_react_agent(llm, tools)
    messages = state["messages"]
    sys_msg = {
        "role": "system",
        "content": (
            "You are the Enterprise Sales Assistant. You can provide revenue metrics, retrieve previous customer order history, "
            "consult pricing and discount playbooks, create new sales orders, and generate analytical PDF/Excel reports. For orders above $1,000, "
            "state that human manager authorization is initiated.\n\n"
            "ORDER HISTORY & PREVIOUS TRANSACTIONS:\n"
            "- When the user asks for previous orders, order history, purchases, or spend for a customer ID, call 'get_customer_orders' with the customer_id.\n\n"
            "CRITICAL INSTRUCTION — ONE QUESTION AT A TIME:\n"
            "When the user wants to create or place a sales order and some details are missing, you MUST ask for ONLY ONE piece of information at a time:\n"
            "1. If Customer ID is missing, ask ONLY: 'Could you please provide your Customer ID?'\n"
            "2. If Customer ID is known but product is missing, ask ONLY which product they need:\n"
            "   (1: Enterprise AI Suite - $1,200 | 2: Professional Cloud Agent - $450 | 3: Starter Knowledge Base - $150)\n"
            "3. If Customer ID and product are known but quantity is missing, ask ONLY: 'How many units would you like to order?'\n"
            "4. Once Customer ID, product_id (1, 2, or 3), and quantity are all known, immediately call 'create_sales_order'!\n\n"
            "Always inspect previous conversation turns so you remember what the user already provided.\n\n"
            "When generating a PDF report, you MUST invoke the 'generate_pdf_report' tool with an executive title, "
            "a list of structured 'Key: Value' summary lines, and a filename ending in '.pdf'. "
            "Never tell the user a report was created without calling 'generate_pdf_report'."
        )
    }
    
    result = agent.invoke({"messages": [sys_msg] + messages})
    new_messages = result["messages"][1 + len(messages):]
    return {"messages": new_messages}
