from typing import Annotated, Sequence, TypedDict, List, Optional
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict, total=False):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str
    user_role: str
    user_id: int
    user_name: str
    denied_agent: str
    denied_reason: str
    require_approval: bool
    approval_granted: bool
    pending_action: dict
