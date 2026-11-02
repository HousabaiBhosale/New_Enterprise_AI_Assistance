from datetime import datetime
from sqlalchemy.orm import Session
import models

def log_audit(
    db: Session,
    action: str,
    resource: str,
    details: str = "",
    user_id: int = None,
    user_name: str = "System",
    status: str = "SUCCESS"
) -> models.AuditLog:
    """Log an event into the immutable audit trail table."""
    try:
        log_entry = models.AuditLog(
            timestamp=datetime.utcnow(),
            user_id=user_id,
            user_name=user_name,
            action=action,
            resource=resource,
            details=details,
            status=status
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as e:
        print(f"Error logging audit: {e}")
        db.rollback()
        return None
