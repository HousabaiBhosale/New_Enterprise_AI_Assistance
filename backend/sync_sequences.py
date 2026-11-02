from database import engine
from sqlalchemy import text

tables = [
    'leave_requests',
    'orders',
    'support_tickets',
    'users',
    'approval_requests',
    'knowledge_documents',
    'audit_logs',
    'employees',
    'products'
]

def fix_sequences():
    with engine.begin() as conn:
        for t in tables:
            try:
                seq = conn.execute(text(f"SELECT pg_get_serial_sequence('{t}', 'id')")).scalar()
                max_id = conn.execute(text(f"SELECT COALESCE(MAX(id), 0) FROM {t}")).scalar()
                if seq and max_id is not None:
                    # setval to max_id, is_called = True so nextval will return max_id + 1
                    target_val = max(max_id, 100)
                    conn.execute(text(f"SELECT setval('{seq}', {target_val}, true)"))
                    print(f"Table '{t}': set '{seq}' to {target_val}")
            except Exception as e:
                print(f"Error on {t}: {e}")
    print("Done fixing sequences!")

if __name__ == "__main__":
    fix_sequences()
