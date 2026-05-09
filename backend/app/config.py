from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "WhatsApp Business Assistant"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-this-in-production-to-a-random-secret"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/whatsapp_assistant"
    DATABASE_SYNC_URL: str = "postgresql://postgres:postgres@db:5432/whatsapp_assistant"

    # Meta / WhatsApp Cloud API
    WHATSAPP_API_VERSION: str = "v21.0"
    WHATSAPP_API_URL: str = "https://graph.facebook.com"
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    WHATSAPP_BUSINESS_ACCOUNT_ID: str = ""
    WHATSAPP_ACCESS_TOKEN: str = ""
    WHATSAPP_VERIFY_TOKEN: str = "whatsapp_verify_token_2024"
    META_APP_SECRET: str = ""

    # Groq AI (Llama 3.3)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    AI_MAX_TOKENS: int = 1024
    AI_TEMPERATURE: float = 0.7

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    # Business Config
    BUSINESS_NAME: str = "TechStore Pro"
    BUSINESS_HOURS: str = "9:00 AM - 6:00 PM"
    BUSINESS_TIMEZONE: str = "Asia/Kolkata"

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
