#!/usr/bin/env python3
"""Run script for the FastAPI application."""

import uvicorn
from app.core.config import settings


def main():
    """Run the FastAPI application."""
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )


if __name__ == "__main__":
    main()
