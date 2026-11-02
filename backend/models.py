from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

# User & Authentication Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="employee")  # admin, hr, sales, support, employee
    department = Column(String, default="General")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Audit Trail Model
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String, default="System")
    action = Column(String, nullable=False)  # e.g., "QUERY_PROCESSED", "TOOL_EXECUTED", "LEAVE_APPLIED", "APPROVAL_ACTION"
    resource = Column(String, nullable=False)  # e.g., "HR_AGENT", "DATABASE", "DOCUMENTS"
    details = Column(Text, nullable=True)
    status = Column(String, default="SUCCESS")  # SUCCESS, WARNING, FAILED

# Human-in-the-Loop (HITL) Approvals
class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, default="General")  # HR, Sales, Support, Finance
    requested_by_agent = Column(String, nullable=False)  # e.g., "HR Agent", "Sales Agent"
    impact = Column(String, nullable=True)  # e.g. "$24,000", "5 Days Leave", "Tier-1 Escalation"
    confidence = Column(Integer, default=85)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    reviewer_name = Column(String, nullable=True)

# Knowledge Documents Management
class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, default="General")  # HR, Sales, Support, Policy
    file_size = Column(String, default="0 KB")
    chunk_count = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

# HR Models
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    department = Column(String)
    leave_balance = Column(Integer, default=20)
    is_active = Column(Boolean, default=True)
    
    leave_requests = relationship("LeaveRequest", back_populates="employee")

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    
    employee = relationship("Employee", back_populates="leave_requests")

# Sales Models
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    
    orders = relationship("Order", back_populates="product")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    total_price = Column(Float)
    order_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Completed")  # Completed, Cancelled
    
    product = relationship("Product", back_populates="orders")

# Support Models
class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    subject = Column(String)
    description = Column(String)
    priority = Column(String, default="Medium")  # Low, Medium, High, Critical
    status = Column(String, default="Open")  # Open, In Progress, Escalated, Closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
