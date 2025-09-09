from supabase import create_client
from app.core.config import settings

def get_supabase_client():
    """
    Supabase 클라이언트를 반환합니다.
    """
    return create_client(settings.supabase_url, settings.supabase_key)

# 싱글톤 인스턴스 생성
supabase = get_supabase_client() 