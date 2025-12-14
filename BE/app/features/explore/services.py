import logging
from typing import List, Optional
from datetime import datetime, timedelta
from app.shared.database.supabase_client import supabase
from app.features.explore.models import (
    PublicStorybookSummary,
    ExploreStoriesParams,
    ExploreStoriesResponse,
    CategoryInfo,
    ExploreCategoriesResponse,
    LikeResponse,
    ViewResponse,
    AuthorInfo,
    PaginationInfo,
    SortType
)
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


class ExploreService:
    def __init__(self):
        self.supabase = supabase

    def get_public_storybooks(self, params: ExploreStoriesParams) -> ExploreStoriesResponse:
        """공개된 동화책 목록을 조회합니다."""
        try:
            # 기본 쿼리: 공개된 동화책만
            query = self.supabase.table("storybooks").select(
                "id, title, cover_image_url, category, tags, like_count, view_count, page_count, created_at, user_id"
            ).eq("is_public", True)

            # 검색어 필터
            if params.q:
                query = query.ilike("title", f"%{params.q}%")

            # 카테고리 필터
            if params.category:
                query = query.eq("category", params.category)

            # 태그 필터
            if params.tags:
                for tag in params.tags:
                    query = query.contains("tags", [tag])

            # 정렬
            if params.sort == SortType.LATEST:
                query = query.order("created_at", desc=True)
            elif params.sort == SortType.POPULAR:
                query = query.order("like_count", desc=True)
            elif params.sort == SortType.VIEWED:
                query = query.order("view_count", desc=True)

            # 총 개수 조회
            count_response = query.execute()
            total = len(count_response.data) if count_response.data else 0

            # 페이지네이션
            offset = (params.page - 1) * params.limit
            query = query.range(offset, offset + params.limit - 1)

            # 실행
            response = query.execute()
            if not response.data:
                return ExploreStoriesResponse(
                    stories=[],
                    pagination=PaginationInfo(
                        page=params.page,
                        total=0,
                        has_next=False,
                        has_prev=False
                    )
                )

            # 작성자 정보 조회
            user_ids = list(set([story["user_id"] for story in response.data]))
            authors_response = self.supabase.table("profiles").select(
                "id, full_name, avatar_url"
            ).in_("id", user_ids).execute()

            authors = {author["id"]: author for author in (authors_response.data or [])}

            # 응답 데이터 변환
            stories = []
            for story in response.data:
                author_data = authors.get(story["user_id"], {})
                author = AuthorInfo(
                    id=story["user_id"],
                    name=author_data.get("full_name", "Unknown"),
                    avatar_url=author_data.get("avatar_url")
                )

                storybook = PublicStorybookSummary(
                    id=story["id"],
                    title=story["title"],
                    cover_image_url=story.get("cover_image_url"),
                    author=author,
                    category=story.get("category"),
                    tags=story.get("tags") if story.get("tags") is not None else None,
                    like_count=story.get("like_count", 0),
                    view_count=story.get("view_count", 0),
                    page_count=story.get("page_count", 0),
                    is_public=True,
                    created_at=story["created_at"]
                )
                stories.append(storybook)

            # 페이지네이션 정보
            has_next = offset + params.limit < total
            has_prev = params.page > 1

            return ExploreStoriesResponse(
                stories=stories,
                pagination=PaginationInfo(
                    page=params.page,
                    total=total,
                    has_next=has_next,
                    has_prev=has_prev
                )
            )

        except Exception as e:
            logger.error("Failed to get public storybooks: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve public storybooks: {str(e)}"
            )

    def get_categories(self) -> ExploreCategoriesResponse:
        """사용 가능한 카테고리 목록을 조회합니다."""
        try:
            # 공개된 동화책의 카테고리별 개수 조회
            response = self.supabase.table("storybooks").select(
                "category"
            ).eq("is_public", True).not_.is_("category", "null").execute()

            if not response.data:
                return ExploreCategoriesResponse(categories=[])

            # 카테고리별 개수 계산
            category_counts = {}
            for story in response.data:
                category = story.get("category")
                if category:
                    category_counts[category] = category_counts.get(category, 0) + 1

            # 응답 데이터 변환
            categories = []
            for category, count in category_counts.items():
                categories.append(CategoryInfo(
                    id=category.lower().replace(" ", "-"),
                    name=category,
                    count=count
                ))

            # 개수 기준으로 정렬
            categories.sort(key=lambda x: x.count, reverse=True)

            return ExploreCategoriesResponse(categories=categories)

        except Exception as e:
            logger.error("Failed to get categories: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve categories: {str(e)}"
            )


    def toggle_like(self, storybook_id: str, user_id: str) -> LikeResponse:
        """동화책에 좋아요를 추가/제거합니다."""
        try:
            # 기존 좋아요 확인
            existing_like = self.supabase.table("storybook_likes").select("*").eq(
                "storybook_id", storybook_id
            ).eq("user_id", user_id).execute()

            if existing_like.data:
                # 좋아요 제거
                self.supabase.table("storybook_likes").delete().eq(
                    "storybook_id", storybook_id
                ).eq("user_id", user_id).execute()

                # 좋아요 수 감소
                self.supabase.table("storybooks").update({
                    "like_count": self.supabase.table("storybooks").select("like_count").eq("id", storybook_id).execute().data[0]["like_count"] - 1
                }).eq("id", storybook_id).execute()

                liked = False
            else:
                # 좋아요 추가
                self.supabase.table("storybook_likes").insert({
                    "storybook_id": storybook_id,
                    "user_id": user_id
                }).execute()

                # 좋아요 수 증가
                self.supabase.table("storybooks").update({
                    "like_count": self.supabase.table("storybooks").select("like_count").eq("id", storybook_id).execute().data[0]["like_count"] + 1
                }).eq("id", storybook_id).execute()

                liked = True

            # 현재 좋아요 수 조회
            storybook_response = self.supabase.table("storybooks").select("like_count").eq("id", storybook_id).execute()
            like_count = storybook_response.data[0]["like_count"] if storybook_response.data else 0

            return LikeResponse(liked=liked, like_count=like_count)

        except Exception as e:
            logger.error("Failed to toggle like for storybook %s: %s", storybook_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to toggle like: {str(e)}"
            )

    def increment_view_count(self, storybook_id: str) -> ViewResponse:
        """동화책 조회수를 증가시킵니다."""
        try:
            # 조회수 증가
            response = self.supabase.table("storybooks").update({
                "view_count": self.supabase.table("storybooks").select("view_count").eq("id", storybook_id).execute().data[0]["view_count"] + 1
            }).eq("id", storybook_id).execute()

            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Storybook not found"
                )

            view_count = response.data[0]["view_count"]
            return ViewResponse(view_count=view_count)

        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to increment view count for storybook %s: %s", storybook_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to increment view count: {str(e)}"
            )


# 서비스 인스턴스
explore_service = ExploreService()
