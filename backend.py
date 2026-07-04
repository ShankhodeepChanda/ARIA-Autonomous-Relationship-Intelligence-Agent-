from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from groq import Groq
from fastapi import FastAPI

load_dotenv()

app = FastAPI()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Lead(BaseModel):
    name: str
    event: str
    city: str
    score: int
    product: str

# ── SCOUT AGENT ──────────────────────────
@app.post("/api/scout")
def scout(lead: Lead):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a lead detection agent for SBI Bank.
Given a lead's life event, extract key information.
Reply in this EXACT format, no extra text:
INTENT: <intent>
AGE_BRACKET: <age range>
CITY: <city>
SCORE: <number>
REASON: <one line reason>"""
            },
            {
                "role": "user",
                "content": f"Lead: {lead.name} from {lead.city}. Life event: {lead.event}. Priority score: {lead.score}"
            }
        ]
    )
    raw = response.choices[0].message.content
    lines = dict(l.split(": ", 1) for l in raw.strip().splitlines() if ": " in l)
    return {
        "intent": lines.get("INTENT", lead.event),
        "age": lines.get("AGE_BRACKET", "24-32"),
        "city": lines.get("CITY", lead.city),
        "score": lines.get("SCORE", str(lead.score)),
        "reason": lines.get("REASON", "High intent signal detected")
    }

# ── PROFILER AGENT ───────────────────────
@app.post("/api/profiler")
def profiler(lead: Lead):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a financial profiling agent for SBI Bank.
Given a lead, build their financial persona and recommend a product.
Reply in this EXACT format, no extra text:
INCOME: <income bracket>
RISK: <LOW/MEDIUM/HIGH>
PRODUCT: <product name>
OFFER: <special offer one line>"""
            },
            {
                "role": "user",
                "content": f"{lead.name} from {lead.city}. Event: {lead.event}. Score: {lead.score}. Suggested product: {lead.product}"
            }
        ]
    )
    raw = response.choices[0].message.content
    lines = dict(l.split(": ", 1) for l in raw.strip().splitlines() if ": " in l)
    return {
        "income": lines.get("INCOME", "₹8L-₹15L p.a."),
        "risk": lines.get("RISK", "LOW"),
        "product": lines.get("PRODUCT", lead.product),
        "offer": lines.get("OFFER", "Zero fee for first year")
    }

# ── ENGAGEMENT AGENT ─────────────────────
@app.post("/api/engagement")
def engagement(lead: Lead):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """You are a personalised outreach agent for SBI Bank.
Write a short WhatsApp message (max 3 lines) to the prospect.
Rules:
- Use their first name
- Reference their life event naturally  
- Mention the product and one benefit
- End with a clear call to action
- Friendly tone, not salesy
- No generic phrases like Dear Customer
- Output the message text only, nothing else"""
            },
            {
                "role": "user",
                "content": f"Name: {lead.name}. City: {lead.city}. Event: {lead.event}. Product: {lead.product}"
            }
        ]
    )
    return {
        "message": response.choices[0].message.content.strip()
    }

# ── ONBOARDING AGENT ─────────────────────
@app.post("/api/onboarding")
def onboarding(lead: Lead):
    import random
    account_no = f"SBI{random.randint(1000000000, 9999999999)}"
    return {
        "accountNo": account_no,
        "status": "ACTIVE",
        "product": lead.product,
        "yono": "Credentials sent via SMS"
    }