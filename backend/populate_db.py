import random
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()
from database import SessionLocal, engine, Base, sync_postgres_sequences
import models
from auth import hash_password

def populate_database():
    print("Populating database with full enterprise dataset...")
    # Drop and recreate to sync updated schemas
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Users (with hashed passwords)
    sample_users = [
        models.User(
            name="System Administrator",
            email="admin@enterprise.com",
            hashed_password=hash_password("password123"),
            role="admin",
            department="Executive"
        ),
        models.User(
            name="Sarah Jenkins (HR Manager)",
            email="hr@enterprise.com",
            hashed_password=hash_password("password123"),
            role="hr",
            department="HR"
        ),
        models.User(
            name="David Miller (Sales Director)",
            email="sales@enterprise.com",
            hashed_password=hash_password("password123"),
            role="sales",
            department="Sales"
        ),
        models.User(
            name="Alex Rivera (Support Lead)",
            email="support@enterprise.com",
            hashed_password=hash_password("password123"),
            role="support",
            department="Support"
        ),
        models.User(
            name="John Doe (Senior Engineer)",
            email="employee@enterprise.com",
            hashed_password=hash_password("password123"),
            role="employee",
            department="Engineering"
        ),
    ]
    db.add_all(sample_users)
    db.commit()

    # 2. Seed Employees
    departments = ["Engineering", "Sales", "HR", "Marketing", "Support"]
    employees = []
    for i in range(1, 26):
        emp = models.Employee(
            id=i,
            name=f"Enterprise Employee {i}",
            email=f"employee{i}@enterprise.com",
            department=random.choice(departments),
            leave_balance=random.randint(8, 25),
            is_active=True
        )
        employees.append(emp)
    db.add_all(employees)
    db.commit()

    # 3. Seed Leave Requests
    leave_requests = []
    for i in range(1, 12):
        emp_id = random.randint(1, 25)
        start_date = datetime.now() + timedelta(days=random.randint(1, 20))
        end_date = start_date + timedelta(days=random.randint(1, 5))
        req = models.LeaveRequest(
            id=i,
            employee_id=emp_id,
            start_date=start_date,
            end_date=end_date,
            reason=random.choice(["Annual Family Vacation", "Medical Leave", "Conference Attendance", "Personal Time"]),
            status=random.choice(["Pending", "Approved", "Approved", "Rejected"])
        )
        leave_requests.append(req)
    db.add_all(leave_requests)
    db.commit()

    # 4. Seed Products & Orders
    products = [
        models.Product(id=1, name="Enterprise AI Suite", description="Full LLM workflow automation for 500+ seats", price=1200.0),
        models.Product(id=2, name="Professional Cloud Agent", description="Mid-tier agentic assistance for up to 50 seats", price=450.0),
        models.Product(id=3, name="Starter Knowledge Base", description="Single department RAG search system", price=150.0)
    ]
    db.add_all(products)
    db.commit()

    orders = []
    for i in range(1, 35):
        prod_id = random.randint(1, 3)
        qty = random.randint(1, 4)
        price = [1200.0, 450.0, 150.0][prod_id - 1]
        order = models.Order(
            id=i,
            customer_id=random.randint(1001, 1040),
            product_id=prod_id,
            quantity=qty,
            total_price=qty * price,
            order_date=datetime.now() - timedelta(days=random.randint(0, 120)),
            status=random.choice(["Completed", "Completed", "Completed", "Cancelled"])
        )
        orders.append(order)
    db.add_all(orders)
    db.commit()

    # 5. Seed Support Tickets
    tickets = [
        models.SupportTicket(id=1, customer_id=1002, subject="SSO login failure on Chrome", description="SAML assertion timed out during executive login.", priority="High", status="Open"),
        models.SupportTicket(id=2, customer_id=1005, subject="Request for API quota bump", description="Customer approaching 100k daily token limit.", priority="Medium", status="In Progress"),
        models.SupportTicket(id=3, customer_id=1008, subject="Refund request for duplicate license", description="Accidental double billing on October invoice.", priority="High", status="Escalated"),
        models.SupportTicket(id=4, customer_id=1012, subject="Qdrant vector latency spike", description="Search responses taking > 800ms.", priority="Critical", status="Open"),
        models.SupportTicket(id=5, customer_id=1019, subject="Export to PDF character encoding", description="Unicode characters garbled in German report.", priority="Low", status="Closed"),
    ]
    db.add_all(tickets)
    db.commit()

    # 6. Seed Human-in-the-Loop (HITL) Approvals
    approvals = [
        models.ApprovalRequest(
            id=1,
            title="Q4 Enterprise Discount Exception",
            description="Client 'TechGlobal Inc.' requested 25% discount on 100x Enterprise Suite ($90,000 total). Exceeds automatic 15% cap.",
            category="Sales",
            requested_by_agent="Sales Agent",
            impact="$90,000 Deal",
            confidence=92,
            status="Pending"
        ),
        models.ApprovalRequest(
            id=2,
            title="Extended Medical Leave (> 5 days) - John Doe",
            description="Employee 1 requested 10 days consecutive leave for surgical recovery.",
            category="HR",
            requested_by_agent="HR Agent",
            impact="10 Days Leave",
            confidence=96,
            status="Pending"
        ),
        models.ApprovalRequest(
            id=3,
            title="Customer SLA Breach Escalation: TCK-1008",
            description="Support ticket #3 billing dispute exceeded 24-hour standard SLA threshold.",
            category="Support",
            requested_by_agent="Customer Support Agent",
            impact="High Risk SLA",
            confidence=85,
            status="Pending"
        )
    ]
    db.add_all(approvals)
    db.commit()

    # 7. Seed Knowledge Documents
    docs = [
        models.KnowledgeDocument(id=1, filename="hr_policy.md", title="Global HR Policies & Benefits Manual", category="HR", file_size="1.2 KB", chunk_count=5),
        models.KnowledgeDocument(id=2, filename="sales_playbook.md", title="Enterprise Sales Playbook & Pricing", category="Sales", file_size="1.1 KB", chunk_count=4),
        models.KnowledgeDocument(id=3, filename="support_sop.md", title="Customer Support Standard Operating Procedures", category="Support", file_size="1.3 KB", chunk_count=5),
    ]
    db.add_all(docs)
    db.commit()

    # 8. Seed Audit Logs
    audit_events = [
        models.AuditLog(user_name="admin@enterprise.com", action="SYSTEM_INITIALIZATION", resource="CORE_API", details="System database populated and schema validated.", status="SUCCESS"),
        models.AuditLog(user_name="hr@enterprise.com", action="QUERY_PROCESSED", resource="HR_AGENT", details="Query: 'Check leave balance for employee 1'", status="SUCCESS"),
        models.AuditLog(user_name="sales@enterprise.com", action="TOOL_EXECUTED", resource="SALES_AGENT", details="Executed: get_sales_revenue()", status="SUCCESS"),
        models.AuditLog(user_name="System", action="HITL_TRIGGERED", resource="HITL_APPROVAL", details="Approval request #1 routed to manager queue", status="WARNING"),
    ]
    db.add_all(audit_events)
    db.commit()

    print("Database successfully populated with enterprise seed data!")
    sync_postgres_sequences()
    db.close()

if __name__ == "__main__":
    populate_database()
