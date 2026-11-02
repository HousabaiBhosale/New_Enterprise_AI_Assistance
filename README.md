# Agentic Enterprise AI Assistant

> **Department of Artificial Intelligence & Machine Learning**  
> **Basaveshwar Engineering College, Bagalkot**  
> **Course Project Work (22UAI706P)**

An enterprise conversational AI platform that provides a single intelligent interface for accessing organizational knowledge and automating business workflows. The platform combines Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), LangGraph multi-agent architecture, vector databases (Qdrant), relational databases (PostgreSQL / SQLite), Role-Based Access Control (RBAC), and Human-in-the-Loop (HITL) approval mechanisms.

---

## Architecture Overview

- **Supervisor Agent (LangGraph):** Orchestrates multi-agent routing between specialized domains based on user intent.
- **Specialized Domain Agents:**
  - **HR Agent:** Leave balance queries, leave applications, and policy RAG search.
  - **Sales Agent:** Revenue queries, order placement, pricing playbooks, and report compilation.
  - **Customer Support Agent:** Ticket status lookup, ticket creation, SLA triage, and human escalations.
- **Enterprise Knowledge Base (RAG):** Dynamic document ingestion and semantic search using Qdrant vector database and FastEmbed embeddings.
- **Human-in-the-Loop (HITL):** Managed authorization queue for sensitive enterprise actions (extended leaves, high-value transactions, ticket escalations).
- **Audit Trail:** Tamper-evident logging tracking all LLM decisions, tool calls, and user actions.
- **Automated Reporting:** Generates downloadable executive reports in PDF and Excel format from live operational records.
- **Real-Time Communication:** WebSockets & REST endpoints for live agent workflow step inspection.

---

## Default Test Accounts

| Role | Email | Password | Department | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@enterprise.com` | `password123` | Executive | Full platform access, audit trail, user & role governance |
| **HR Manager** | `hr@enterprise.com` | `password123` | HR | HR Agent, employee records, leave approvals, HR reports |
| **Sales Director** | `sales@enterprise.com` | `password123` | Sales | Sales Agent, order processing, revenue analytics, exports |
| **Support Lead** | `support@enterprise.com` | `password123` | Support | Support Agent, ticket triage queue, SLA management |
| **Employee** | `employee@enterprise.com` | `password123` | Engineering | General chat, leave balance checks, knowledge base search |

---

## Quick Start Guide

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Populate seed database & index knowledge documents
python populate_db.py
python vector_store.py

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be live at: `http://localhost:8000`  
Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend Web UI will be live at: `http://localhost:5173`

---

## API Endpoints

- `POST /api/auth/login` & `POST /api/auth/register` – Authentication & JWT issuance
- `POST /api/chat` – LangGraph supervisor and domain agent execution
- `WS /ws/chat` – Real-time bi-directional chat & live workflow streaming
- `GET /api/approvals` & `POST /api/approvals/{id}/action` – Human-in-the-Loop review
- `GET /api/documents` & `POST /api/documents/upload` – Qdrant RAG document ingestion
- `GET /api/reports` & `POST /api/reports/generate` – PDF/Excel generation and download
- `GET /api/admin/audit-logs` – Audit trail records
- `GET /api/admin/users`, `/roles`, `/permissions` – RBAC security matrix
- `GET /api/hr/stats`, `/api/sales/stats`, `/api/support/stats` – Operational metrics
