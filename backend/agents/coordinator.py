import os
from typing import Literal, Optional, List
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel
from .state import AgentState
from .hr_agent import process_hr_query
from .sales_agent import process_sales_query
from .support_agent import process_support_query

class Route(BaseModel):
    next: Literal["hr", "sales", "support", "FINISH"]
    reason: str

def get_llm():
    return ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)

# -------------------------------------------------------------
# Role-Based Access Control (RBAC) Permissions Matrix
# -------------------------------------------------------------
ROLE_PERMISSIONS = {
    "admin": ["hr", "sales", "support"],
    "hr": ["hr"],
    "sales": ["sales"],
    "support": ["support"],
    "staff": ["support"],
    "employee": ["hr", "support"]  # HR self-service + Support helpdesk; NO Sales revenue/orders
}

ROLE_DESCRIPTIONS = {
    "ADMIN": "Full System Administrator access across all enterprise agents, databases, and audit logs.",
    "HR": "Human Resources, employee attendance, workforce leave balances, and organizational policies.",
    "SALES": "Commercial pipeline, sales revenue analytics, deal pricing, and customer orders.",
    "SUPPORT": "Customer helpdesk incident triage, SLA response management, and support SOPs.",
    "STAFF": "Customer helpdesk incident triage, SLA response management, and support SOPs.",
    "EMPLOYEE": "Self-service HR leave inquiries, employee benefits, and general helpdesk support."
}

def supervisor_node(state: AgentState):
    """The Supervisor Agent that analyzes intent and enforces enterprise RBAC boundaries."""
    llm = get_llm()
    
    system_prompt = (
        "You are a supervisor managing an HR agent, a Sales agent, and a Support agent.\n"
        "Based on the conversation history and the user's latest request, decide which agent should handle it.\n"
        "IMPORTANT CONTINUITY RULE: If there is an ongoing task or follow-up question (for example, the HR agent asked for an Employee ID, number of days, or reason, and the user just answered with '1', '2 days', or 'family function'), MAINTAIN CONVERSATIONAL CONTINUITY and route to that same agent ('hr')!\n"
        "If the query is about leaves, policies, employees, or HR reports, route to 'hr'.\n"
        "If it is about revenue, products, prices, orders, or sales playbook, route to 'sales'.\n"
        "If it is about tickets, helpdesk, customer issues, requests, refunds, or support SOP, route to 'support'.\n"
        "If the conversation is over or the request is fulfilled, route to 'FINISH'."
    )
    
    messages = [{"role": "system", "content": system_prompt}] + state["messages"]
    
    try:
        router = llm.with_structured_output(Route)
        decision = router.invoke(messages)
        target_agent = decision.next
    except Exception:
        # Heuristic fallback if LLM structured output call fails
        target_agent = "hr"
        for m in reversed(state["messages"]):
            txt = getattr(m, "content", "").lower()
            if any(w in txt for w in ["leave", "employee", "vacation", "sick", "annual", "policy", "benefit"]):
                target_agent = "hr"
                break
            elif any(w in txt for w in ["sale", "revenue", "order", "price", "product", "discount"]):
                target_agent = "sales"
                break
            elif any(w in txt for w in ["ticket", "helpdesk", "support", "issue", "problem", "help", "refund"]):
                target_agent = "support"
                break
    
    if target_agent == "FINISH":
        return {"next": "FINISH"}

    # Enforce RBAC security policy
    user_role = state.get("user_role", "admin").lower()
    allowed_agents = ROLE_PERMISSIONS.get(user_role, ["admin"])

    # If role is admin or target_agent is permitted
    if user_role == "admin" or target_agent in allowed_agents:
        return {"next": target_agent}
    else:
        # Route to security boundary node
        return {
            "next": "unauthorized",
            "denied_agent": target_agent,
            "denied_reason": f"Role '{user_role.upper()}' is restricted from accessing {target_agent.upper()} Agent."
        }

def unauthorized_node(state: AgentState):
    """Handles blocked requests when a user attempts to access an unauthorized domain."""
    role = state.get("user_role", "employee").upper()
    denied = state.get("denied_agent", "the requested").upper()
    role_scope = ROLE_DESCRIPTIONS.get(role, "Restricted internal personnel access.")

    response_text = (
        f"⛔ **Access Restricted (Role-Based Access Control)**\n\n"
        f"Your current account role (**{role}**) does not have authorization to access the **{denied} Agent**.\n\n"
        f"### Departmental Boundary Policy:\n"
        f"- **Your Authorized Scope:** {role_scope}\n"
        f"- **Security Rule:** Cross-departmental agent access is strictly governed. Only **System Administrators** hold global access across all agents (HR, Sales, Support).\n\n"
        f"💡 *To query {denied} metrics, please sign in with an authorized {denied.capitalize()} or System Admin account.*"
    )
    return {"messages": [AIMessage(content=response_text)]}

def create_workflow():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("hr", process_hr_query)
    workflow.add_node("sales", process_sales_query)
    workflow.add_node("support", process_support_query)
    workflow.add_node("unauthorized", unauthorized_node)
    
    # Add edges
    workflow.add_edge(START, "supervisor")
    
    workflow.add_conditional_edges(
        "supervisor",
        lambda x: x["next"],
        {
            "hr": "hr",
            "sales": "sales",
            "support": "support",
            "unauthorized": "unauthorized",
            "FINISH": END
        }
    )
    
    workflow.add_edge("hr", END)
    workflow.add_edge("sales", END)
    workflow.add_edge("support", END)
    workflow.add_edge("unauthorized", END)
    
    return workflow.compile()

agent_workflow = create_workflow()

def process_query_with_details(
    query: str,
    history: Optional[List[dict]] = None,
    user_role: str = "admin",
    user_id: int = 1,
    user_name: str = "User"
) -> dict:
    """Invokes workflow with RBAC context and returns response along with execution steps."""
    msgs = []
    if history:
        for m in history:
            role = m.get("type") or m.get("role")
            text = m.get("text") or m.get("content", "")
            if text:
                if role in ["user", "human"]:
                    msgs.append(HumanMessage(content=text))
                elif role in ["agent", "ai", "assistant"]:
                    msgs.append(AIMessage(content=text))
    msgs.append(HumanMessage(content=query))

    initial_state = {
        "messages": msgs,
        "user_role": user_role,
        "user_id": user_id,
        "user_name": user_name,
        "require_approval": False,
        "approval_granted": False,
        "pending_action": {}
    }
    
    # 1. Routing step
    try:
        sup_result = supervisor_node(initial_state)
        chosen_agent = sup_result.get("next", "hr")
        denied_agent = sup_result.get("denied_agent", "")
    except Exception:
        chosen_agent = "hr"
        denied_agent = ""

    # 2. Execution step
    # Merge supervisor routing result into initial_state
    state_to_run = {**initial_state, **sup_result}
    result = agent_workflow.invoke(state_to_run)
    final_message = result["messages"][-1].content
    
    if chosen_agent == "unauthorized":
        steps = [
            {"name": "Supervisor Intent Analysis", "status": "completed", "detail": f"Mapped intent to '{denied_agent.upper()}' domain"},
            {"name": "RBAC Security Evaluation", "status": "failed", "detail": f"Role '{user_role.upper()}' rejected from '{denied_agent.upper()}' Agent"},
            {"name": "Security Boundary Response", "status": "completed", "detail": "Generated access restriction notice"}
        ]
        agent_display = "RBAC Security Gate"
    else:
        steps = [
            {"name": "Supervisor Intent Analysis", "status": "completed", "detail": f"Analyzed intent and validated permissions for role '{user_role.upper()}'"},
            {"name": f"Routed to {chosen_agent.upper()} Agent", "status": "completed", "detail": f"Handled by specialized {chosen_agent} workflow"},
            {"name": "Knowledge & Tool Execution", "status": "completed", "detail": "Queried Qdrant embeddings and executed transactional tools"},
            {"name": "Response Synthesis", "status": "completed", "detail": "Synthesized grounded enterprise answer"}
        ]
        agent_display = f"{chosen_agent.capitalize()} Agent (LangGraph ReAct)"

    return {
        "response": final_message,
        "agent_used": agent_display,
        "steps": steps
    }

def process_query(query: str, user_role: str = "admin") -> str:
    """Wrapper function for API to call the LangGraph workflow."""
    details = process_query_with_details(query, user_role=user_role)
    return details["response"]
