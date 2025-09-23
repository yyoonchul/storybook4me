"""Clerk authentication utilities (production-grade JWKS verification)."""

from typing import Dict, Any, Optional
from fastapi import HTTPException, status
import jwt
from jwt import PyJWKClient
from app.core.config import settings


class ClerkAuth:
    """Clerk authentication handler using JWKS (RS256)."""

    _jwk_client: Optional[PyJWKClient] = None

    def _get_jwk_client(self) -> PyJWKClient:
        """Create or return cached JWK client for Clerk instance."""
        if self._jwk_client is None:
            jwks_url = f"https://{settings.clerk_domain}/.well-known/jwks.json"
            self._jwk_client = PyJWKClient(jwks_url)
        return self._jwk_client

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify Clerk JWT: signature, issuer, audience, exp/nbf.

        Returns decoded claims on success; raises HTTPException 401 on failure.
        """
        try:
            jwk_client = self._get_jwk_client()
            signing_key = jwk_client.get_signing_key_from_jwt(token).key

            issuer = f"https://{settings.clerk_domain}"

            # 60s leeway for minor clock skew
            payload = jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience=settings.clerk_audience,
                issuer=issuer,
                options={
                    "require": ["sub", "iss", "aud", "exp"],
                },
                leeway=60,
            )

            if not payload.get("sub"):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token: missing subject (sub)",
                )

            return payload

        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )
        except jwt.InvalidAudienceError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token audience",
            )
        except jwt.InvalidIssuerError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token issuer",
            )
        except jwt.PyJWKClientError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"JWKS error: {str(e)}",
            )
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token verification failed: {str(e)}",
            )


# Global instance
clerk_auth = ClerkAuth()
