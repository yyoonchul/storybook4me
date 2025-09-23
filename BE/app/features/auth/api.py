"""Authentication API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Dict, Any
import logging
from app.shared.database.supabase_client import supabase
from app.features.auth.deps import get_current_claims, get_current_user_id

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger("auth.api")


@router.get("/me")
async def get_user_profile(current_user_id: str = Depends(get_current_user_id), current_user: Dict[str, Any] = Depends(get_current_claims)):
    """Verify token, extract Clerk user id, and return profile from DB.

    Business rule: profiles table primary key equals Clerk user id (sub).
    """
    try:
        # Extract user information from Clerk token payload
        user_id = current_user_id
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing user id in token")
        logger.debug("Requesting profile for user_id(sub)=%s", user_id)

        # Fetch profile where profiles.id == clerk user id (sub)
        db_resp = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        logger.debug("Supabase response received. type=%s", type(db_resp).__name__)

        profile = getattr(db_resp, "data", None)
        if profile is None:
            logger.info("Profile not found for user_id=%s", user_id)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

        # Optional user-facing basics from token
        email = current_user.get("email")
        first_name = current_user.get("given_name", "")
        last_name = current_user.get("family_name", "")
        full_name = f"{first_name} {last_name}".strip()

        logger.debug("Profile fetch succeeded for user_id=%s", user_id)
        return {
            "user_id": user_id,
            "email": email,
            "full_name": full_name,
            "profile": profile,
        }

    except HTTPException:
        logger.exception("HTTPException in /api/auth/me")
        raise
    except Exception as e:
        logger.exception("Unhandled error in /api/auth/me: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )