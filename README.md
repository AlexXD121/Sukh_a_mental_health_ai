# Sukh - Mental Health AI Assistant

**Sukh** is an AI-powered mental health assistant designed to support users through empathetic conversations, calming music, meditation, and journaling.  
It combines a FastAPI backend running an AI model with a modern React frontend built using Vite and Tailwind CSS.

---

## ✨ Features

- Chat with an AI assistant specialized in mental health support (English & Hindi)  

- Play soothing music and guided meditation audio tracks  

- Journal your thoughts with full Create, Read, Update, Delete (CRUD) functionality 

- Mood tracking and personalized activity suggestions (e.g., walk, meditation, calm music)

---

## 📂 Project Structure

/backend    # FastAPI backend for AI chat & API endpoints

/frontend   # React frontend built with Vite & Tailwind CSS


## 🔧 How to Run the Project

### 📦 1. Frontend (React + Vite + Tailwind CSS)

#### ✅ Steps:

```bash
cd frontend
npm install        
npm run dev        

## for backend 

## imp lib :-

pip install fastapi uvicorn httpx pydantic python-dotenv

## or use :-

pip install -r requirements.txt

cd backend
python -m venv venv
source venv/bin/activate       # Windows par: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload      # Backend start karo

