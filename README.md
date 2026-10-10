# New Enterprise AI Assistance

This project provides an AI-powered Enterprise Assistance application featuring a React-based frontend and a Python backend.

## Project Structure

- `frontend/`: The frontend application built with React and Vite. It contains all UI components for Chat, Dashboards (Sales, HR, Support), Documents, and Reports.
- `backend/`: The backend service built with Python. It contains API endpoints, AI agents, and a database layer (SQLite and Qdrant).

## Getting Started

### Prerequisites
- Node.js (for the frontend)
- Python 3.10+ (for the backend)
- Docker (optional, if you prefer running it in containers)

### Running the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Set up a Python virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Running the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Using Docker
You can also run the entire application using Docker Compose (make sure Docker is installed):
```bash
cd backend
docker-compose up --build
```
