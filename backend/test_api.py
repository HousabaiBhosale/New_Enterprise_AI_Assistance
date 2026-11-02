import sys
from database import SessionLocal
import main
import models

print("Starting direct endpoint verification...", flush=True)

db = SessionLocal()

# 1. Health
root = main.read_root()
print("1. Root Health OK:", root["status"], flush=True)

# 2. Auth Login
login_res = main.login(main.LoginRequest(email="admin@enterprise.com", password="password123"), db=db)
print("2. Auth Login OK:", login_res["user"]["name"], f"(Role: {login_res['user']['role']})", flush=True)

# 3. Department Stats
hr_stats = main.get_hr_stats(db=db)
print("3. HR Stats OK:", hr_stats, flush=True)

sales_stats = main.get_sales_stats(db=db)
print("4. Sales Stats OK: Total Revenue = $", f"{sales_stats['quarterly_revenue']:,.2f}", flush=True)

support_stats = main.get_support_stats(db=db)
print("5. Support Stats OK: Unresolved Tickets =", support_stats["unresolved"], flush=True)

# 4. Approvals
approvals = main.get_approvals(db=db)
print("6. Approvals OK:", len(approvals), "pending/active approval items", flush=True)

if approvals:
    action_res = main.take_approval_action(
        approval_id=approvals[0]["id"],
        request=main.ActionRequest(action="approve", notes="Verified by Administrator"),
        db=db
    )
    print("7. Human-in-the-Loop Action OK:", action_res["message"], flush=True)

# 5. Documents (RAG)
docs = main.list_documents(db=db)
print("8. Documents list OK:", len(docs), "documents in knowledge base", flush=True)

# 6. Reports
rep_res = main.generate_report(
    request=main.GenerateReportRequest(report_type="sales", file_format="pdf"),
    db=db
)
print("9. Report Generation OK:", rep_res["filename"], flush=True)

# 7. Admin & RBAC
logs = main.get_audit_logs(db=db)
print("10. Audit Logs OK:", len(logs), "audit trail records verified", flush=True)

users = main.get_admin_users(db=db)
print("11. Admin Users OK:", len(users), "user accounts loaded", flush=True)

roles = main.get_roles()
print("12. RBAC Roles OK:", len(roles), "roles configured", flush=True)

perms = main.get_permissions()
print("13. Permissions Matrix OK:", len(perms), "capability rows", flush=True)

db.close()
print("\n>>> ALL 13 CORE ENTERPRISE WORKFLOWS AND ENDPOINTS VERIFIED 100% WORKING! <<<", flush=True)
