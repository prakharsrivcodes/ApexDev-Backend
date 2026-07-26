import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(title="Gemini AI Engine")

# Initialize Gemini Client (automatically retrieves GEMINI_API_KEY from environment)
client = genai.Client()

# Define request schema for data validation
class ChatRequest(BaseModel):
    prompt: str

# Health check endpoint
@app.get("/")
def home():
    return {"status": "Python AI Microservice is running!"}

# Endpoint for AI content generation
@app.post("/generate")
def generate_ai_response(request: ChatRequest):
    try:
        # Request content generation from Gemini 2.5 Flash model
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=request.prompt,
        )
        
        # Return structured response to caller
        return {
            "success": True,
            "reply": response.text
        }
    except Exception as e:
        # Handle runtime errors and return 500 status
        raise HTTPException(status_code=500, detail=str(e))