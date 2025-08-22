Stumps Chumps is a project that uses a machine learning model to detect fingers through a webcam, integrated with a React-Vite frontend and a Python backend.
Project Structure

frontend: React-Vite application for the user interface.
backend: Python server with the .pth ML model for finger detection.

Prerequisites

Node.js (v16 or higher)
Python (v3.8 or higher)
Webcam
Git

Setup Instructions

Clone the Repository
git clone https://github.com/iammanojeet/stumps-chumps.git
cd Stumps-Chumps


Frontend Setup
cd frontend
npm i
npm run dev


Backend Setup
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000



Usage

Start the backend server (ensure all dependencies are installed first):cd backend
pip install --no-cache-dir -r requirements.txt
uvicorn server:app --reload --port 8000


Run the frontend:cd frontend
npm i
npm run dev


Open http://localhost:5173 in your browser.
Allow webcam access for finger detection.

Dependencies

Frontend: React, Vite
Backend: FastAPI, PyTorch, OpenCV
Full list in frontend/package.json and backend/requirements.txt

Contributing

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-branch).
Open a pull request.

License
MIT License
