from typing import Annotated, Sequence, TypedDict, List
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str
    require_approval: bool
    approval_granted: bool
    pending_action: dict
