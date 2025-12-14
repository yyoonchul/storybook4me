from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.features.auth.clerk_auth import clerk_auth

security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


def get_current_claims(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Verify the Authorization bearer token and return JWT claims.

    Use this dependency in any route to access verified claims.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization token")

    claims = clerk_auth.verify_token(token)
    return claims


def get_current_user_id(claims: Dict[str, Any] = Depends(get_current_claims)) -> str:
    """Extract and return the Clerk user id (sub) from verified claims."""
    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing sub")
    return user_id


def get_optional_claims(credentials: HTTPAuthorizationCredentials | None = Depends(optional_security)) -> Dict[str, Any] | None:
    """Return verified claims if Authorization header is present; otherwise None."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return clerk_auth.verify_token(credentials.credentials)
    except Exception:
        # If provided but invalid, treat as unauthenticated for public routes
        return None


def get_optional_user_id(claims: Dict[str, Any] | None = Depends(get_optional_claims)) -> str | None:
    if not claims:
        return None
    return claims.get("sub")
