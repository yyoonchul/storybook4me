"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.features.waitlist import router as waitlist_router
from app.features.auth.api import router as auth_router
from app.features.family.api import router as family_router
from app.features.storybook.api import router as storybook_router
from app.features.explore.api import router as explore_router
from app.features.user_file.api import router as upload_router
from app.features.studio.api.data import router as studio_data_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure properly for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(waitlist_router, prefix="/api")
    app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
    app.include_router(family_router, prefix="/api/family", tags=["family"])
    app.include_router(storybook_router, prefix="/api/storybooks", tags=["storybooks"])
    app.include_router(explore_router, prefix="/api/explore", tags=["explore"])
    app.include_router(upload_router, prefix="/api")
    app.include_router(studio_data_router, prefix="/api/studio", tags=["studio"])
    
    # Removed temporary global validation handler
    
    # Health check route
    @app.get("/")
    async def health_check():
        """Health check endpoint."""
        return {"status": "healthy", "app": settings.app_name}
    
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
