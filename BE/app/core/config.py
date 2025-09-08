"""Core configuration for the FastAPI application."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    app_name: str = "Nova Labs Storybook API"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra environment variables


settings = Settings()
