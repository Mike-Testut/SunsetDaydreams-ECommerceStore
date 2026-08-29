
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="Sunset Daydreams AI Service",
    description="AI customer-service API for the Sunset Daydreams storefront",
    version="0.1.0"
)

class ChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=500,
    )

class ChatResponse(BaseModel):
    reply: str

@app.get("/")
def root():
    return {
        "message": "Sunset Daydreams AI service is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    return ChatResponse(
        reply=f"You asked: {request.message}"
    )