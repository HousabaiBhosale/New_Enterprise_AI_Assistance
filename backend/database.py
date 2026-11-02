import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = os.path.join(os.path.dirname(__file__), "enterprise.db")
DEFAULT_SQLITE = f"sqlite:///{DB_PATH}"

DATABASE_URL = os.getenv("DATABASE_URL", None)

if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
    try:
        test_engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 2})
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine = test_engine
        print(f"Connected to PostgreSQL at {DATABASE_URL}")
    except Exception as e:
        print(f"PostgreSQL connection unavailable ({e}). Falling back to local SQLite at {DB_PATH}")
        engine = create_engine(DEFAULT_SQLITE, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DEFAULT_SQLITE, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def sync_postgres_sequences():
    """Ensure PostgreSQL primary key sequences match the max existing IDs."""
    if engine.dialect.name == "postgresql":
        tables = [
            'leave_requests', 'orders', 'support_tickets', 'users',
            'approval_requests', 'knowledge_documents', 'audit_logs',
            'employees', 'products'
        ]
        with engine.begin() as conn:
            for t in tables:
                try:
                    conn.execute(text(f"""
                        SELECT setval(
                            pg_get_serial_sequence('{t}', 'id'),
                            COALESCE((SELECT MAX(id) FROM {t}), 1)
                        );
                    """))
                except Exception:
                    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

