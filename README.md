# ARIA — Autonomous Relationship & Intelligence Agent

> **SBI Global Fintech Fest 2026 Hackathon** — Agentic AI for Bank Customer Acquisition

ARIA is a four-agent autonomous AI pipeline that finds, profiles, engages, and onboards bank customers — with zero human intervention required for standard cases. Instead of waiting for customers to walk in, ARIA proactively catches high-intent life events (a new job, a salary hike, a marriage, a new home) and takes a prospect from that moment to an active account in under five minutes.

---

## The Problem

Customer acquisition in banking is reactive. The customer's real moment of need happens somewhere else — unseen and unaddressed — while the bank waits. Meanwhile, AI agents are increasingly the first point of contact for financial decisions, and banks have no autonomous presence in that channel.

---

## How ARIA Works

Four agents run in sequence. Each one does one job and passes its output to the next.

```
Life Event Signal
      ↓
🔍 Scout Agent       — detects intent, scores the lead
      ↓
🧠 Profiler Agent    — builds financial persona, matches best SBI product
      ↓
💬 Engagement Agent  — writes & sends a personalised WhatsApp/email message
      ↓
🏦 Onboarding Agent  — guides eKYC, verifies identity, activates account
      ↓
✅ Account Live in CBS / YONO / CRM
```

**End-to-end latency:** ~5 minutes. Human agents required: 0.

---

## Demo

The prototype includes a live React dashboard connected to a real Python backend running LLM inference (Groq) for all four agents.

- Select any lead from the pipeline table
- Click **▶ Run Full Pipeline**
- Watch all 4 agents execute in real time, each card filling with actual AI-generated output
- Analytics (intent breakdown, product match rate, acquisition funnel) update live from agent output

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript |
| Backend | Python, FastAPI |
| LLM Inference | Groq — Llama 3.1 |
| Agent Orchestration | Custom multi-agent pipeline (FastAPI) |
| Knowledge Grounding | RAG over SBI product catalog |
| KYC (production path) | Aadhaar eKYC, document OCR, liveness detection |
| Engagement Channels | WhatsApp Business API, email, SMS |

---

## Project Structure

```
aria-lead-accelerator-main/   ← React/TypeScript frontend
├── src/
│   └── routes/
│       └── index.tsx         ← main dashboard + agent pipeline logic
├── package.json
└── ...

backend.py                    ← FastAPI backend, all 4 agent endpoints
.env                          ← API keys (not committed)
```

---



## Agent Endpoints

| Endpoint | Agent | What it does |
|---|---|---|
| `POST /api/scout` | Scout | Classifies intent, scores lead |
| `POST /api/profiler` | Profiler | Builds financial persona, matches product |
| `POST /api/engagement` | Engagement | Generates personalised outreach message |
| `POST /api/onboarding` | Onboarding | Simulates KYC, generates account number |

---

## Business Case

- **Lower acquisition cost** — automates the full funnel for standard-profile customers
- **Faster time-to-revenue** — days compressed to minutes between life event and active account
- **Defensive channel positioning** — banks that build an autonomous AI presence become share takers; those that don't become share donors
- **Incremental rollout** — modular architecture allows starting with one product line and expanding once validated

---

## Hackathon Submission

Built solo for the **SBI Global Fintech Fest 2026 Hackathon** — problem statement: *"Develop Agentic AI solutions capable of autonomously assisting banks with acquiring, onboarding and engaging customers."*

This is a working prototype, not a mockup. The React frontend, Python backend, and Groq LLM inference are all wired together and demoable end to end.

---

## Author

**Shankhodeep Chanda**  
SBI GFF Hackathon 2026 — Solo Submission
