from fastapi import APIRouter, Depends, Query, status
from typing import List, Optional
from app.features.explore.models import (
    ExploreStoriesParams,
    ExploreStoriesResponse,
    ExploreCategoriesResponse,
    LikeResponse,
    ViewResponse,
    SortType
)
from app.features.explore.services import explore_service
from app.features.auth.deps import get_current_user_id

router = APIRouter()


@router.get("/stories", response_model=ExploreStoriesResponse)
async def get_public_storybooks(
    q: Optional[str] = Query(None, description="검색어"),
    category: Optional[str] = Query(None, description="카테고리 필터"),
    tags: Optional[str] = Query(None, description="태그 필터 (쉼표로 구분)"),
    sort: SortType = Query(SortType.LATEST, description="정렬 기준 (latest, popular, viewed)"),
    page: int = Query(1, ge=1, description="페이지 번호"),
    limit: int = Query(20, ge=1, le=100, description="페이지당 항목 수")
):
    """공개된 동화책 목록을 검색, 필터링, 정렬하여 조회합니다."""
    # 태그 문자열을 배열로 변환
    tag_list = None
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

    params = ExploreStoriesParams(
        q=q,
        category=category,
        tags=tag_list,
        sort=sort,
        page=page,
        limit=limit
    )

    return explore_service.get_public_storybooks(params)


@router.get("/categories", response_model=ExploreCategoriesResponse)
async def get_categories():
    """사용 가능한 카테고리 목록을 조회합니다."""
    return explore_service.get_categories()


@router.post("/stories/{storybook_id}/like", response_model=LikeResponse)
async def toggle_like(
    storybook_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """동화책에 좋아요를 추가/제거합니다."""
    return explore_service.toggle_like(storybook_id, current_user_id)


@router.post("/stories/{storybook_id}/view", response_model=ViewResponse)
async def increment_view_count(storybook_id: str):
    """동화책 조회수를 증가시킵니다."""
    return explore_service.increment_view_count(storybook_id)
