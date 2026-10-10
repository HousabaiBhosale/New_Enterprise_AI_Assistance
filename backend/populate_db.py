import random
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
import models

def populate_database():
    print("Populating database with mock data...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data for a fresh start (optional, but good for local dev)
    db.query(models.LeaveRequest).delete()
    db.query(models.Employee).delete()
    db.query(models.SupportTicket).delete()
    # Add other tables as needed...
    db.commit()

    # 1. Populate HR Data (Employees)
    departments = ["Engineering", "Sales", "HR", "Marketing", "Support"]
    employees = []
    for i in range(1, 21):
        emp = models.Employee(
            id=i,
            name=f"Employee {i}",
            email=f"employee{i}@enterprise.com",
            department=random.choice(departments),
            leave_balance=random.randint(5, 25),
            is_active=True
        )
        employees.append(emp)
    
    db.add_all(employees)
    db.commit()

    # 2. Populate HR Data (Leave Requests)
    leave_requests = []
    for i in range(1, 10):
        emp_id = random.randint(1, 20)
        start_date = datetime.now() + timedelta(days=random.randint(1, 30))
        end_date = start_date + timedelta(days=random.randint(1, 5))
        req = models.LeaveRequest(
            id=i,
            employee_id=emp_id,
            start_date=start_date,
            end_date=end_date,
            reason="Vacation",
            status=random.choice(["Pending", "Approved", "Rejected"])
        )
        leave_requests.append(req)

    db.add_all(leave_requests)
    db.commit()

    # 3. Populate Sales Data
    products = [
        models.Product(id=1, name="Enterprise Plan", description="Unlimited users", price=500.0),
        models.Product(id=2, name="Pro Plan", description="Up to 50 users", price=200.0),
        models.Product(id=3, name="Basic Plan", description="Up to 5 users", price=50.0)
    ]
    db.add_all(products)
    db.commit()

    orders = []
    for i in range(1, 30):
        prod_id = random.randint(1, 3)
        qty = random.randint(1, 5)
        price = [500.0, 200.0, 50.0][prod_id-1]
        order = models.Order(
            id=i,
            customer_id=random.randint(100, 200),
            product_id=prod_id,
            quantity=qty,
            total_price=qty * price,
            order_date=datetime.now() - timedelta(days=random.randint(0, 365)),
            status=random.choice(["Completed", "Completed", "Completed", "Cancelled"])
        )
        orders.append(order)
    db.add_all(orders)
    db.commit()

    # 4. Populate Support Data
    tickets = []
    for i in range(1, 15):
        ticket = models.SupportTicket(
            id=i,
            customer_id=random.randint(100, 200),
            subject=f"Issue {i} regarding product",
            description=f"Customer is experiencing issue {i} and needs help.",
            status=random.choice(["Open", "In Progress", "Closed"])
        )
        tickets.append(ticket)

    db.add_all(tickets)
    db.commit()

    print("Database populated successfully.")
    db.close()

if __name__ == "__main__":
    populate_database()
