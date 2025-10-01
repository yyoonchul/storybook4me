"""
Service layer for Studio - read/update storybook title.
"""

from fastapi import HTTPException, status
from app.shared.database.supabase_client import supabase
from app.features.storybook.models import Storybook  # reuse comprehensive model if needed
from ..models.data import StorybookTitleResponse


class StudioDataService:
    def get_storybook_title(self, user_id: str, storybook_id: str) -> StorybookTitleResponse:
        try:
            # Fetch only necessary fields to reduce payload
            res = (
                supabase
                .table("storybooks")
                .select("id,title,user_id,is_public")
                .eq("id", storybook_id)
                .single()
                .execute()
            )
            row = res.data
            if not row:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Storybook not found")

            # Authorization: only owner can edit via Studio; allow viewing only if owner
            if row.get("user_id") != user_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

            return StorybookTitleResponse(id=row["id"], title=row.get("title", ""))
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch title: {e}")

    def update_storybook_title(self, user_id: str, storybook_id: str, new_title: str) -> StorybookTitleResponse:
        try:
            # Ensure storybook exists and ownership
            check = (
                supabase
                .table("storybooks")
                .select("id,user_id,title")
                .eq("id", storybook_id)
                .single()
                .execute()
            )
            row = check.data
            if not row:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Storybook not found")
            if row.get("user_id") != user_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

            upd = (
                supabase
                .table("storybooks")
                .update({"title": new_title})
                .eq("id", storybook_id)
                .execute()
            )
            updated = (upd.data or [{}])[0]
            return StorybookTitleResponse(id=updated.get("id", storybook_id), title=updated.get("title", new_title))
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update title: {e}")


studio_data_service = StudioDataService()


