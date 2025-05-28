from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sukh import ask_sukh
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prod mein restrict karna better
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.get("/")
def root():
    return {"message": "Sukh backend is running."}

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_request: ChatRequest):
    user_message = chat_request.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # ask_sukh is synchronous, so just call it directly
    reply = ask_sukh(user_message)
    return ChatResponse(reply=reply)
