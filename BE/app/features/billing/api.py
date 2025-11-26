"""Billing webhook endpoints."""

from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from svix.webhooks import Webhook, WebhookVerificationError

from app.core.config import settings
from app.features.billing.services import sync_subscription_plan, SubscriptionSyncError

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

