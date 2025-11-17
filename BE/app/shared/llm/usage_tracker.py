"""
LLM 사용량 기록 모듈.

단일 함수에서 토큰 합계 산출 및 프로필 크레딧 업데이트를 처리한다.
"""

from __future__ import annotations

import logging
from typing import Any, Mapping

from app.shared.database.profile_repository import increment_credits_used

logger = logging.getLogger(__name__)


def _normalize_tokens(value: int | None) -> int:
    if value is None:
        return 0
    return max(0, int(value))


def record_llm_usage(
    *,
    user_id: str | None,
    provider: str | None,
    model: str | None,
    input_tokens: int | None,
    output_tokens: int | None,
    metadata: Mapping[str, Any] | None = None,
) -> None:
    """
    LLM 호출 후 토큰 사용량을 기록하고 credits_used 를 갱신한다.

    Args:
        user_id: 토큰 사용을 청구할 사용자 ID. 없으면 기록하지 않는다.
        provider: 사용된 LLM 공급자 (로깅용).
        model: 사용된 모델 식별자 (로깅용).
        input_tokens: 프롬프트 토큰 수.
        output_tokens: 생성 토큰 수.
        metadata: 호출 컨텍스트 (storybook_id 등) - 현재는 로깅에만 활용.
    """
    if not user_id:
        return

    total_tokens = _normalize_tokens(input_tokens) + _normalize_tokens(output_tokens)
    if total_tokens <= 0:
        return

    try:
        increment_credits_used(user_id, total_tokens)
    except Exception as exc:  # pragma: no cover - Supabase 오류 대비
        logger.warning(
            "Failed to record LLM usage for user %s (provider=%s, model=%s, tokens=%s, metadata=%s): %s",
            user_id,
            provider,
            model,
            total_tokens,
            metadata,
            exc,
        )


__all__ = ["record_llm_usage"]


