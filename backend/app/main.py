"""
WhatsApp Business Assistant - FastAPI Main Application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
import sys

from app.config import get_settings
from app.database import init_db
from app.routes import webhooks, conversations, contacts, faqs, orders, workflows, analytics, auth

settings = get_settings()

# Configure loguru
logger.remove()
logger.add(sys.stdout, level="INFO", format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}")
logger.add("logs/app.log", rotation="10 MB", retention="7 days", level="DEBUG")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup/shutdown lifecycle."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    await init_db()
    logger.info("Database initialized successfully")

    # Seed demo data on first run
    from app.seed import seed_demo_data
    await seed_demo_data()

    yield
    logger.info("Shutting down application")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-Powered WhatsApp Business Assistant - Automate customer support, "
        "lead management, and order handling through WhatsApp using Meta's Cloud API."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(webhooks.router, prefix="/api")
app.include_router(conversations.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(faqs.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(workflows.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}
