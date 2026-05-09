<![CDATA[# 🤖 AI-Powered WhatsApp Business Assistant

<div align="center">

**Automate customer support, lead management, and order handling through WhatsApp using Meta's Cloud API and AI-powered responses.**

[![Built with FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp_Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://developers.facebook.com/docs/whatsapp/cloud-api)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![Llama 3.3](https://img.shields.io/badge/Llama_3.3-7C3AED?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)

</div>

---

## 🎯 Overview

A **production-quality full-stack SaaS platform** that helps businesses automate customer interactions on WhatsApp. Built with Meta's WhatsApp Cloud API, powered by Llama 3.3 (via Groq), and featuring a premium admin dashboard for complete business automation.

### Key Highlights
- 🧠 **AI-Powered Responses** — Llama 3.3 generates context-aware, intelligent customer replies
- 📱 **WhatsApp Cloud API** — Full Meta API integration with webhooks
- ⚡ **Automation Workflows** — Welcome messages, lead capture, auto-replies, follow-ups
- 📊 **Analytics Dashboard** — Real-time metrics, charts, and conversion tracking
- 💬 **Admin Chat** — Live conversation view with AI/human handoff
- 📦 **Order Tracking** — Simulated order management with WhatsApp queries
- 📚 **FAQ Knowledge Base** — AI uses admin-curated FAQs for accurate responses

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│        React + TailwindCSS + Framer Motion          │
│              Recharts + Lucide Icons                 │
└───────────────────┬────────────────────────────────-─┘
                    │ REST API
┌───────────────────▼─────────────────────────────────┐
│                   Backend (FastAPI)                   │
│          Async Python + SQLAlchemy + Pydantic         │
│    ┌──────────┬──────────┬───────────┬────────────┐  │
│    │ Webhook  │   AI     │ WhatsApp  │ Automation │  │
│    │ Handler  │ Service  │ Service   │  Engine    │  │
│    └──────────┴──────────┴───────────┴────────────┘  │
└───────┬────────────────┬────────────────┬────────────┘
        │                │                │
   ┌────▼────┐    ┌──────▼──────┐   ┌────▼─────┐
   │PostgreSQL│    │ Groq API   │   │ WhatsApp │
   │ Database │    │ (Llama 3.3)│   │Cloud API │
   └──────────┘    └────────────┘   └──────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Meta Developer Account
- Groq API Key

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/whatsapp-business-assistant.git
cd whatsapp-business-assistant

# Copy environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

### 2. Run with Docker

```bash
docker-compose up --build
```

### 3. Access the Application

| Service   | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:3000     |
| Backend   | http://localhost:8000     |
| API Docs  | http://localhost:8000/docs|
| ReDoc     | http://localhost:8000/redoc|

---

## 📱 WhatsApp Cloud API Setup

### Step 1: Create Meta App
1. Go to [Meta Developer Portal](https://developers.facebook.com/)
2. Create a new app → Select **Business** type
3. Add **WhatsApp** product to your app

### Step 2: Configure WhatsApp
1. Navigate to **WhatsApp** → **Getting Started**
2. Note your **Phone Number ID** and **Business Account ID**
3. Generate a **Permanent Access Token**

### Step 3: Set Up Webhook
1. Go to **WhatsApp** → **Configuration**
2. Set Webhook URL: `https://your-domain.com/api/webhook`
3. Set Verify Token: `whatsapp_verify_token_2024`
4. Subscribe to: `messages`, `messaging_postbacks`

### Step 4: Update Environment
```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_access_token
META_APP_SECRET=your_app_secret
GROQ_API_KEY=your_groq_api_key
```

---

## 📁 Project Structure

```
whatsapp-business-assistant/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Environment config
│   │   ├── database.py          # Async SQLAlchemy setup
│   │   ├── seed.py              # Demo data seeder
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   ├── services/
│   │   │   ├── whatsapp_service.py  # WhatsApp Cloud API
│   │   │   ├── ai_service.py        # Groq/Llama 3.3
│   │   │   └── automation_service.py # Workflow engine
│   │   └── routes/
│   │       ├── webhooks.py      # Meta webhook handler
│   │       ├── conversations.py # Chat management
│   │       ├── contacts.py      # Lead management
│   │       ├── faqs.py          # FAQ CRUD
│   │       ├── orders.py        # Order management
│   │       ├── workflows.py     # Automation CRUD
│   │       └── analytics.py     # Dashboard metrics
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── globals.css      # Design system
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx   # Sidebar layout
│   │   │       ├── page.tsx     # Analytics
│   │   │       ├── conversations/
│   │   │       ├── leads/
│   │   │       ├── faqs/
│   │   │       ├── orders/
│   │   │       ├── workflows/
│   │   │       └── settings/
│   │   └── lib/
│   │       ├── types.ts         # TypeScript types
│   │       ├── api.ts           # API client
│   │       └── mock-data.ts     # Demo data
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Documentation

### Webhook Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhook` | Meta webhook verification |
| POST | `/api/webhook` | Process incoming WhatsApp messages |

### Conversation Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | List all conversations |
| GET | `/api/conversations/{id}` | Get conversation with messages |
| PATCH | `/api/conversations/{id}` | Update conversation status |
| POST | `/api/conversations/{id}/messages` | Send admin message |

### Contact/Lead Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | List contacts (filter by status) |
| POST | `/api/contacts` | Create new contact |
| PATCH | `/api/contacts/{id}` | Update contact/lead status |
| DELETE | `/api/contacts/{id}` | Delete contact |

### FAQ Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faqs` | List all FAQs |
| POST | `/api/faqs` | Create FAQ |
| PATCH | `/api/faqs/{id}` | Update FAQ |
| DELETE | `/api/faqs/{id}` | Delete FAQ |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/{id}` | Update order status |

### Workflow Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflows` | List automation workflows |
| POST | `/api/workflows` | Create workflow |
| PATCH | `/api/workflows/{id}` | Update workflow |
| DELETE | `/api/workflows/{id}` | Delete workflow |

### Analytics Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard overview stats |
| GET | `/api/analytics/daily` | Daily metrics (last N days) |
| GET | `/api/analytics/lead-breakdown` | Lead status distribution |

---

## 🧠 AI Integration

The AI assistant uses **Llama 3.3 70B** via **Groq API** for:

- **Context-aware responses** — Maintains conversation history for coherent replies
- **FAQ retrieval** — Uses admin-curated knowledge base for accurate answers
- **Order tracking** — Fetches order data from PostgreSQL for natural responses
- **Intent detection** — Classifies messages (greeting, pricing, order tracking, support)
- **Structured prompts** — Business-context system prompts for professional responses
- **Human handoff** — Detects when to escalate to human agents

---

## 🔄 Automation Workflows

| Workflow | Trigger | Action |
|----------|---------|--------|
| Welcome Message | New conversation | Send branded welcome message |
| Lead Capture | New conversation | Auto-score and tag leads |
| After-Hours Reply | Admin offline | Send availability message |
| Order Confirmation | Order status change | Notify customer |
| Follow-up Reminder | Scheduled (7 days) | Re-engage inactive leads |

---

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 | React framework with App Router |
| Styling | TailwindCSS | Utility-first CSS |
| Animations | Framer Motion | Smooth UI animations |
| Charts | Recharts | Data visualization |
| Backend | FastAPI | Async Python API framework |
| Database | PostgreSQL 16 | Relational data store |
| ORM | SQLAlchemy (async) | Async database queries |
| AI | Llama 3.3 (Groq) | Intelligent response generation |
| Meta API | WhatsApp Cloud API | Message sending/receiving |
| DevOps | Docker Compose | Container orchestration |

---

## 📝 Resume Bullet Points

- Engineered a full-stack **WhatsApp Business Assistant SaaS** platform using **Meta's WhatsApp Cloud API**, **FastAPI**, **Next.js**, and **PostgreSQL**, enabling automated customer support with AI-powered responses
- Integrated **Llama 3.3 (70B)** via Groq API for intelligent, context-aware customer interactions with **FAQ knowledge base retrieval** and **conversation memory**
- Designed and implemented **5 automation workflows** (welcome messages, lead capture, auto-replies, order notifications, follow-ups) using **Meta webhook integration**
- Built a premium **analytics dashboard** with **Recharts** featuring real-time metrics, lead conversion tracking, and message volume visualization
- Implemented **async architecture** with SQLAlchemy async sessions, handling concurrent WhatsApp webhook events with proper error handling and logging
- Created a **live admin chat interface** with AI/human handoff capability, conversation history, and lead management features
- Containerized the full stack with **Docker Compose** (PostgreSQL, FastAPI, Next.js) for production-ready deployment

---

## 🔗 LinkedIn Project Description

> 🚀 Built an AI-Powered WhatsApp Business Assistant — a full-stack SaaS platform that automates customer support, lead management, and order handling through WhatsApp.
>
> 🛠️ Tech: Next.js • FastAPI • PostgreSQL • WhatsApp Cloud API • Llama 3.3 (Groq) • Docker
>
> ✨ Features: AI-powered responses with conversation memory, automation workflows (welcome messages, lead capture, auto-replies), real-time analytics dashboard, admin chat with AI/human handoff, FAQ knowledge base, and order tracking simulation.
>
> 📱 Deeply integrated with Meta's developer ecosystem — WhatsApp Cloud API, webhooks, message templates, and interactive messages.

---

## 📄 License

MIT License - Feel free to use this project for learning, portfolios, and demonstrations.
]]>
