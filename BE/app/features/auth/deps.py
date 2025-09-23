from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.features.auth.clerk_auth import clerk_auth

security = HTTPBearer()


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
