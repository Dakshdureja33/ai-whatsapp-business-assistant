# AI-Powered WhatsApp Business Assistant 🚀

An end-to-end AI automation platform designed for modern businesses. This platform integrates **Meta's WhatsApp Cloud API** with a high-performance **FastAPI** backend and a sleek **Next.js** dashboard to automate customer support, lead management, and order tracking.

---

## 🌐 Live Access (Local Development)

When running the project locally using the provided scripts:

| Service | URL |
|---------|-----|
| **Frontend Dashboard** | [http://localhost:3000](http://localhost:3000) |
| **Backend API** | [http://localhost:8000](http://localhost:8000) |
| **API Documentation** | [http://localhost:8000/docs](http://localhost:8000/docs) |

---

## ✨ Key Features

- **AI-Driven Conversations**: Powered by **Llama 3.3 (via Groq API)** for context-aware responses and FAQ handling.
- **Real-Time Dashboard**: Monitor conversations, leads, and orders in real-time with a modern Next.js interface.
- **Automated Workflows**: Create custom triggers for lead capture, order confirmations, and automated replies.
- **Meta Integration**: Full integration with the **WhatsApp Cloud API**, supporting text, templates, and interactive messages.
- **Webhook Management**: Built-in support for Meta webhooks with automatic public tunnel configuration (localtunnel).

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS, TypeScript.
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic.
- **Database**: SQLite (Local Dev) / PostgreSQL (Production).
- **AI/LLM**: Llama 3.3-70b via Groq.
- **Messaging**: Meta WhatsApp Cloud API.
- **Infrastructure**: Docker, Docker Compose, Localtunnel.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Meta Developer Account (WhatsApp Cloud API access)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory based on the provided `.env.example`:
```env
# Meta Config
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_ACCESS_TOKEN=your_token

# AI Config
GROQ_API_KEY=your_groq_key
```

### 3. Run the Platform
The easiest way to start the entire ecosystem (Frontend, Backend, and Public Tunnel) is using the included automation script:

```bash
chmod +x run_demo.sh
./run_demo.sh
```

---

## 🚀 Deployment

Click the buttons below to deploy this project live to the cloud:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Dakshdureja33/ai-whatsapp-business-assistant)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDakshdureja33%2Fai-whatsapp-business-assistant)

---

## 📁 Project Structure

```
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── routes/     # API Endpoints (Webhooks, Auth, etc.)
│   │   ├── services/   # Business Logic (AI, WhatsApp, Automation)
│   │   └── models/     # Database Schemas
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Dashboard Pages
│   │   └── components/ # UI Components
└── run_demo.sh         # Orchestration Script
```

---

## 📄 License

This project is licensed under the MIT License.

---

**Developed with ❤️ by [Daksh Dureja](https://github.com/Dakshdureja33)**
