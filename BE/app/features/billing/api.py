"""Billing webhook endpoints."""

from fastapi import APIRouter, Header, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
try:
    from svix.webhooks import Webhook, WebhookVerificationError
except Exception as exc:  # pragma: no cover
    # NOTE:
    # `svix` depends on a recent Pydantic which exports `ModelWrapValidatorHandler`
    # from the top-level `pydantic` module. If your environment has an older
    # Pydantic, importing `svix` can crash the app at startup.
    #
    # We keep the server bootable (portfolio/archive friendliness) and surface a
    # clear error only if the billing webhook route is hit.
    Webhook = None  # type: ignore[assignment]
    WebhookVerificationError = Exception  # type: ignore[assignment]
    _SVIX_IMPORT_ERROR: Exception = exc

from app.core.config import settings
from app.features.billing.services import sync_subscription_plan, SubscriptionSyncError, get_user_subscription_plan
from app.features.auth.deps import get_current_user_id

import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["billing"])


@router.post("/webhooks/clerk")
async def handle_clerk_billing_webhook(
    request: Request,
    svix_id: str | None = Header(default=None, convert_underscores=False),
    svix_timestamp: str | None = Header(default=None, convert_underscores=False),
    svix_signature: str | None = Header(default=None, convert_underscores=False),
):
    """
    Verify Clerk Billing webhook payloads using Svix headers.

    Clerk forwards billing events through Svix. We verify the request and
    return 200 so Clerk knows the event was accepted. Downstream logic to
    sync subscriptions can hook into the verified payload later.
    """

    # Debug-level log to confirm that the endpoint is being hit at all
    logger.info("Incoming request to /api/billing/webhooks/clerk")

    missing_headers = [
        name
        for name, value in (
            ("svix-id", svix_id),
            ("svix-timestamp", svix_timestamp),
            ("svix-signature", svix_signature),
        )
        if value is None
    ]
    if missing_headers:
        raise HTTPException(
            status_code=400,
            detail=f"Missing Svix headers: {', '.join(missing_headers)}",
        )

    if Webhook is None:  # pragma: no cover
        raise HTTPException(
            status_code=500,
            detail=(
                "Svix dependency failed to import. "
                "Recreate the backend venv and reinstall requirements. "
                "Expected Pydantic >= 2.12.x (see `BE/requirements.txt`). "
                f"Original error: {_SVIX_IMPORT_ERROR}"
            ),
        )

    secret = settings.clerk_webhook_signing_secret
    if not secret:
        raise HTTPException(
            status_code=500,
            detail="Clerk webhook signing secret is not configured",
        )

    payload = await request.body()
    headers = {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
    }

    try:
        verified_event = Webhook(secret).verify(payload, headers)
    except WebhookVerificationError as exc:
        logger.warning("Failed to verify Clerk billing webhook: %s", exc)
        raise HTTPException(status_code=400, detail="Invalid webhook signature") from exc

    event_type = verified_event.get("type")
    data_preview = verified_event.get("data", {})
    logger.info("Received Clerk billing webhook: type=%s", event_type)
    logger.debug("Clerk billing payload: %s", data_preview)

    if event_type and event_type.startswith("subscription"):
        try:
            sync_subscription_plan(verified_event)
        except SubscriptionSyncError as exc:
            logger.error("Failed to sync subscription plan: %s", exc)
            raise HTTPException(
                status_code=500,
                detail="Failed to sync subscription data",
            ) from exc
    else:
        logger.info("Skipping unsupported billing event type: %s", event_type)

    return JSONResponse({"status": "ok"})


@router.get("/subscription")
async def get_subscription(current_user_id: str = Depends(get_current_user_id)):
    """
    Get the current user's subscription plan type.
    
    Returns the plan_type from the subscriptions table, defaulting to "free" if not found.
    """
    try:
        plan_type = get_user_subscription_plan(current_user_id)
        return {"plan_type": plan_type}
    except Exception as e:
        logger.exception("Failed to get subscription plan for user %s: %s", current_user_id, e)
        # Return "free" as default on error
        return {"plan_type": "free"}

