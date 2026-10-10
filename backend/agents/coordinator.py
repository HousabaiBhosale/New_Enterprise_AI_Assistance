from typing import Literal
from langchain_core.messages import HumanMessage, BaseMessage
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

def supervisor_node(state: AgentState):
    """The Supervisor Agent that decides which department to route to."""
    llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0, max_tokens=512)
    
    system_prompt = (
        "You are a supervisor managing an HR agent, a Sales agent, and a Support agent. "
        "Based on the user's request, decide which agent should handle it. "
        "If the query is about leaves, policies, employees, route to 'hr'. "
        "If it is about revenue, products, prices, or sales playbook, route to 'sales'. "
        "If it is about tickets, customer issues, refunds, or support SOP, route to 'support'. "
        "If the conversation is over or the request is fulfilled, route to 'FINISH'."
    )
    
    messages = [{"role": "system", "content": system_prompt}] + state["messages"]
    
    # We use structured output to force the LLM to return a Route object
    router = llm.with_structured_output(Route)
    decision = router.invoke(messages)
    
    return {"next": decision.next}

def create_workflow():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("hr", process_hr_query)
    workflow.add_node("sales", process_sales_query)
    workflow.add_node("support", process_support_query)
    
    # Add edges
    workflow.add_edge(START, "supervisor")
    
    # The supervisor decides what to do next
    workflow.add_conditional_edges(
        "supervisor",
        lambda x: x["next"],
        {
            "hr": "hr",
            "sales": "sales",
            "support": "support",
            "FINISH": END
        }
    )
    
    # Worker agents always report back to the supervisor when done with their turn
    workflow.add_edge("hr", END)
    workflow.add_edge("sales", END)
    workflow.add_edge("support", END)
    
    return workflow.compile()

# Compile the graph globally so it can be imported by main.py
agent_workflow = create_workflow()

def process_query(query: str) -> str:
    """Wrapper function for API to call the LangGraph workflow."""
    initial_state = {
        "messages": [HumanMessage(content=query)],
        "require_approval": False,
        "approval_granted": False,
        "pending_action": {}
    }
    
    # Run the graph
    result = agent_workflow.invoke(initial_state)
    
    # Extract the last message
    final_message = result["messages"][-1].content
    return final_message
