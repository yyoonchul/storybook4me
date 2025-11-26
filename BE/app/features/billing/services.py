"""Subscription sync services for billing events."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List

from app.shared.database.supabase_client import supabase
from app.core.config import settings


class SubscriptionSyncError(Exception):
    """Raised when a subscription sync operation fails."""


def determine_plan_type(subscription_items: List[Dict[str, Any]]) -> str:
    """
    Reduce Clerk subscription items into a `plan_type` string.

    Currently we only distinguish between "free" and "plus":
    - If an item matches the configured Clerk Plus plan ID, mark as plus.
    - Otherwise fall back to checking whether the plan amount is > 0.
    """
    plus_plan_id = settings.clerk_plus_plan_id

    for item in subscription_items:
        plan_id = item.get("plan_id") or ""

        if plus_plan_id and plan_id == plus_plan_id:
            return "plus"

        plan = item.get("plan") or {}
        amount = plan.get("amount")
        if not plus_plan_id and isinstance(amount, (int, float)) and amount and amount > 0:
            return "plus"

    return "free"


def sync_subscription_plan(event: Dict[str, Any]) -> None:
    """
    Upsert the `subscriptions` table so the user's plan reflects Clerk billing events.

    The logic is intentionally focused on plan tracking (free vs plus). Other columns
    remain untouched for now.
    """
    subscription_data = event.get("data")
    if not isinstance(subscription_data, dict):
        raise SubscriptionSyncError("Event payload is missing subscription data")

    payer = subscription_data.get("payer") or {}
    user_id = payer.get("user_id")
    if not user_id:
        raise SubscriptionSyncError("Subscription event is missing payer.user_id")

    items = subscription_data.get("items") or []
    plan_type = determine_plan_type(items)

    upsert_payload = {
        "user_id": user_id,
        "plan_type": plan_type,
        # Keep status in sync if provided, otherwise leave untouched
        "status": subscription_data.get("status"),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    # Remove `status` if Clerk didn't send one to avoid overwriting with null
    if upsert_payload["status"] is None:
        upsert_payload.pop("status")

    try:
        supabase.table("subscriptions").upsert(
            upsert_payload,
            on_conflict="user_id",
        ).execute()
    except Exception as exc:
        raise SubscriptionSyncError(f"Failed to upsert subscription: {exc}") from exc


def get_user_subscription_plan(user_id: str) -> str:
    """
    Get the user's subscription plan type from the subscriptions table.
    
    Returns "free" if no subscription record exists or plan_type is null.
    Returns "plus" if the user has a plus plan.
    """
    try:
        response = supabase.table("subscriptions").select("plan_type").eq("user_id", user_id).single().execute()
        
        if response.data and response.data.get("plan_type"):
            plan_type = response.data["plan_type"]
            # Ensure we only return valid plan types
            if plan_type in ("free", "plus"):
                return plan_type
        
        return "free"
    except Exception:
        # If no record found or any error, default to "free"
        return "free"

