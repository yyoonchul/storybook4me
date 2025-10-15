"""
Service layer for Storybook feature.
"""

from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from app.shared.database.supabase_client import supabase
from .models import (
    Storybook,
    StorybookSummary,
    StorybookListResponse,
    StorybookResponse,
    CreateStorybookRequest,
    StorybookStatus,
    Page,
)


class StorybookService:
    def list_storybooks(self, user_id: str, page: int = 1, limit: int = 20, sort: str = "created_at", order: str = "desc") -> StorybookListResponse:
        try:
            # Base query scoped to user
            query = supabase.table("storybooks").select("*").eq("user_id", user_id)

            # Sorting
            desc = order.lower() != "asc"
            if sort not in {"created_at", "like_count"}:
                sort = "created_at"
            query = query.order(sort, desc=desc)

            # Pagination
            if limit > 100:
                limit = 100
            offset = (page - 1) * limit
            query = query.range(offset, offset + limit - 1)

            res = query.execute()
            rows: List[Dict[str, Any]] = res.data or []

            # Total count (approx via second query)
            count_res = supabase.table("storybooks").select("id", count="exact").eq("user_id", user_id).execute()
            total = count_res.count or 0

            items = [
                StorybookSummary(
                    id=r["id"],
                    title=r.get("title", ""),
                    cover_image_url=r.get("cover_image_url"),
                    status=StorybookStatus(r.get("status", "pending")),
                    is_public=r.get("is_public", False),
                    created_at=r.get("created_at", ""),
                    page_count=r.get("page_count", 0),
                    like_count=r.get("like_count", 0),
                    view_count=r.get("view_count", 0),
                )
                for r in rows
            ]

            return StorybookListResponse(storybooks=items, total=total, page=page, limit=limit)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to list storybooks: {e}")

    def create_storybook(self, user_id: str, req: CreateStorybookRequest) -> Storybook:
        try:
            insert = {
                "user_id": user_id,
                "title": req.title,
                "cover_image_url": None,
                "status": StorybookStatus.pending.value,
                "is_public": False,
                "page_count": req.page_count or 0,
                "character_ids": req.character_ids or [],
                "creation_params": {
                    "theme": req.theme,
                    "style": req.style,
                    "pageCount": req.page_count,
                    "prompt": req.prompt,
                    "arc": {},
                    "bible": {},
                },
            }

            res = supabase.table("storybooks").insert(insert).execute()
            if not res.data or not isinstance(res.data, list):
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create storybook")
            row = res.data[0]
            return Storybook(**row)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create storybook: {e}")

    def get_storybook(self, user_id: Optional[str], storybook_id: str) -> Storybook:
        try:
            res = supabase.table("storybooks").select("*").eq("id", storybook_id).single().execute()
            if not res.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Storybook not found")
            row = res.data
            # Allow if owner or public
            if user_id is None:
                if not row.get("is_public"):
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            else:
                if row.get("user_id") != user_id and not row.get("is_public"):
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            storybook = Storybook(**row)

            # Fetch pages ordered by page_number
            pages_res = (
                supabase.table("pages")
                .select("*")
                .eq("storybook_id", storybook_id)
                .order("page_number")
                .execute()
            )
            pages_rows: List[Dict[str, Any]] = pages_res.data or []
            pages = [
                Page(
                    id=p["id"],
                    storybook_id=p.get("storybook_id", storybook_id),
                    page_number=p.get("page_number", 0),
                    script_text=p.get("script_text"),
                    image_url=p.get("image_url"),
                    audio_url=p.get("audio_url"),
                    image_prompt=p.get("image_prompt"),
                    image_style=p.get("image_style"),
                    character_ids=p.get("character_ids"),
                    background_description=p.get("background_description"),
                    created_at=p.get("created_at"),
                )
                for p in pages_rows
            ]

            storybook.pages = pages
            return storybook
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to get storybook: {e}")

    # update_storybook removed (moved to Studio scope)

    def set_visibility(self, user_id: str, storybook_id: str, is_public: bool) -> Storybook:
        try:
            _ = self.get_storybook(user_id, storybook_id)
            res = supabase.table("storybooks").update({"is_public": is_public}).eq("id", storybook_id).execute()
            if not res.data or not isinstance(res.data, list):
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update visibility")
            row = res.data[0]
            return Storybook(**row)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update visibility: {e}")

    def delete_storybook(self, user_id: str, storybook_id: str) -> None:
        try:
            _ = self.get_storybook(user_id, storybook_id)
            supabase.table("storybooks").delete().eq("id", storybook_id).execute()
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to delete storybook: {e}")


storybook_service = StorybookService()

