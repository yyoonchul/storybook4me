"""
프로필 관련 데이터베이스 연산을 담당하는 모듈.

현재는 LLM 토큰 사용량에 따른 credits_used 증가만을 책임진다.
"""

from __future__ import annotations

from typing import Any

from app.shared.database.supabase_client import supabase


class ProfileRepositoryError(Exception):
    """profiles 테이블 조작 중 발생한 예외."""


def increment_credits_used(user_id: str | None, amount: int) -> None:
    """
    주어진 사용자 ID의 credits_used 값을 amount 만큼 증가시킨다.

    Args:
        user_id: Supabase profiles 테이블의 기본 키 (클럭 user id와 동일)
        amount: 증가시킬 크레딧 (토큰 수). 0 이하는 무시된다.
    """
    if not user_id or amount <= 0:
        return

    payload: dict[str, Any] = {"p_user_id": user_id, "p_amount": amount}

    # 먼저 Postgres RPC 함수를 시도한다 (존재한다면 원자적 증가 지원).
    try:
        supabase.rpc("increment_profile_credits", payload).execute()
        return
    except Exception:
        # RPC 미구현일 수 있으므로 select + update 로 폴백한다.
        pass

    try:
        current_resp = (
            supabase.table("profiles")
            .select("credits_used")
            .eq("id", user_id)
            .single()
            .execute()
        )
    except Exception as exc:  # pragma: no cover - Supabase 오류 처리
        raise ProfileRepositoryError(
            f"Failed to fetch current credits for user {user_id}"
        ) from exc

    current_value = 0
    if current_resp.data:
        current_value = current_resp.data.get("credits_used") or 0

    try:
        supabase.table("profiles").update(
            {"credits_used": current_value + amount}
        ).eq("id", user_id).execute()
    except Exception as exc:  # pragma: no cover
        raise ProfileRepositoryError(
            f"Failed to update credits for user {user_id}"
        ) from exc


