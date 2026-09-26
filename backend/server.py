from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import asyncio
from google import genai
from google.genai import types


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

ALFRED_SYSTEM = (
    "You are Alfred, a warm and personable AI travel assistant for EaseMyTrip. "
    "When a user describes a travel mood or preference, respond conversationally in 1-2 sentences, "
    "then suggest exactly 2-3 destinations in India. For each destination, return: name, a short "
    "evocative description (under 20 words), a category tag (choose one: Adventure, Culture, Relaxation), "
    "an approximate round-trip flight price in INR from Bengaluru, and flight duration. Format your response "
    "as JSON matching this structure: { \"message\": string, \"destinations\": [{ \"name\": string, "
    "\"description\": string, \"category\": string, \"flightPrice\": number, \"duration\": string }] }. "
    "When asked to build an itinerary, generate a day-by-day plan with 2-3 named activities/meals per day, "
    "using realistic-sounding local spot names. Stay strictly on travel topics. Never discuss pricing for "
    "flights/hotels/bookings — that data comes from a separate system, not from you."
)


class AlfredRequest(BaseModel):
    mode: str
    text: str = ""
    destination: str = ""
    days: int = Field(default=4, ge=1, le=10)


def _extract_json(raw: str):
    s = (raw or "").strip()
    if s.startswith("```"):
        s = re.sub(r"^```(?:json)?", "", s).strip()
        s = re.sub(r"```$", "", s).strip()
    start, end = s.find("{"), s.rfind("}")
    if start != -1 and end != -1:
        s = s[start:end + 1]
    return json.loads(s)


@api_router.post("/alfred/chat")
async def alfred_chat(req: AlfredRequest):
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(status_code=503, detail="AI not configured")
    if req.mode == "itinerary":
        user_text = (
            f"Build a {req.days}-day travel itinerary for {req.destination}. "
            "Return ONLY JSON in this exact shape: "
            "{\"message\": string, \"days\": [{\"label\": \"Day 1\", \"stops\": "
            "[{\"kind\": \"meal\"|\"place\", \"label\": string, \"detail\": string}]}]}. "
            "Each day must include stops in order: Breakfast, Place 1, Lunch, Place 2, Place 3, Dinner. "
            "label is the slot name (e.g. 'Breakfast', 'Place 1'); detail is the realistic-sounding local spot name."
        )
    else:
        user_text = req.text or "Inspire me with a travel destination in India."
    try:
        client = genai.Client(api_key=api_key)
        gemini_resp = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-3-flash-preview",
            contents=user_text,
            config=types.GenerateContentConfig(system_instruction=ALFRED_SYSTEM),
        )
        text = gemini_resp.text
        data = _extract_json(text)
        return {"ok": True, "data": data}
    except Exception:
        logger.exception("alfred_chat failed")
        raise HTTPException(status_code=502, detail="AI call failed")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()