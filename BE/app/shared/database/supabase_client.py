from __future__ import annotations

from functools import lru_cache
from urllib.parse import urlparse

from supabase import create_client

from app.core.config import settings


class SupabaseNotConfiguredError(RuntimeError):
    """Raised when Supabase settings are missing/invalid."""


def _looks_like_url(value: str) -> bool:
    try:
        parsed = urlparse(value)
    except Exception:
        return False
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


@lru_cache(maxsize=1)
def get_supabase_client():
    """
    Supabase 클라이언트를 반환합니다.

    NOTE:
    This project is archived/portfolio-oriented. We deliberately avoid creating
    the client at import-time so the app can still boot even when `.env` is not
    configured. The first DB access will raise a clear error instead.
    """
    supabase_url = (settings.supabase_url or "").strip()
    supabase_key = (settings.supabase_key or "").strip()

    if not supabase_url or not supabase_key:
        raise SupabaseNotConfiguredError(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in `BE/.env` "
            "(see `BE/.env.example`)."
        )

    if not _looks_like_url(supabase_url):
        raise SupabaseNotConfiguredError(
            "Invalid SUPABASE_URL. Expected an http(s) URL like "
            "`https://xxxx.supabase.co` (see `BE/.env.example`)."
        )

    return create_client(supabase_url, supabase_key)


class _LazySupabaseProxy:
    def __getattr__(self, name: str):
        return getattr(get_supabase_client(), name)


# Keep the original import style:
# `from app.shared.database.supabase_client import supabase`
supabase = _LazySupabaseProxy()