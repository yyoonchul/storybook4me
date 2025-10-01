"""
Service layer for Studio - read/update storybook title and page content.
"""

from fastapi import HTTPException, status
from app.shared.database.supabase_client import supabase
from app.features.storybook.models import Storybook  # reuse comprehensive model if needed
from ..models.data import StorybookTitleResponse, PageContentResponse, PageContentUpdateRequest
from typing import Optional, List


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

    def get_page_content(self, user_id: str, storybook_id: str, page_number: int) -> PageContentResponse:
        """Get page content for a specific page in a storybook."""
        try:
            # First verify storybook ownership
            storybook_check = (
                supabase
                .table("storybooks")
                .select("id,user_id")
                .eq("id", storybook_id)
                .single()
                .execute()
            )
            storybook = storybook_check.data
            if not storybook:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Storybook not found")
            if storybook.get("user_id") != user_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

            # Fetch page content
            res = (
                supabase
                .table("pages")
                .select("id,page_number,script_text,image_url,audio_url,image_prompt,image_style,character_ids,background_description,created_at")
                .eq("storybook_id", storybook_id)
                .eq("page_number", page_number)
                .single()
                .execute()
            )
            row = res.data
            if not row:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")

            return PageContentResponse(
                id=row["id"],
                page_number=row["page_number"],
                script_text=row.get("script_text"),
                image_url=row.get("image_url"),
                audio_url=row.get("audio_url"),
                image_prompt=row.get("image_prompt"),
                image_style=row.get("image_style"),
                character_ids=row.get("character_ids", []),
                background_description=row.get("background_description"),
                created_at=row["created_at"]
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch page content: {e}")

    def update_page_content(self, user_id: str, storybook_id: str, page_number: int, update_data: PageContentUpdateRequest) -> PageContentResponse:
        """Update page content for a specific page in a storybook."""
        try:
            # First verify storybook ownership
            storybook_check = (
                supabase
                .table("storybooks")
                .select("id,user_id")
                .eq("id", storybook_id)
                .single()
                .execute()
            )
            storybook = storybook_check.data
            if not storybook:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Storybook not found")
            if storybook.get("user_id") != user_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

            # Check if page exists
            page_check = (
                supabase
                .table("pages")
                .select("id")
                .eq("storybook_id", storybook_id)
                .eq("page_number", page_number)
                .single()
                .execute()
            )
            if not page_check.data:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found")

            # Prepare update data (only include non-None values)
            update_dict = {}
            if update_data.script_text is not None:
                update_dict["script_text"] = update_data.script_text
            if update_data.image_prompt is not None:
                update_dict["image_prompt"] = update_data.image_prompt
            if update_data.image_style is not None:
                update_dict["image_style"] = update_data.image_style
            if update_data.character_ids is not None:
                update_dict["character_ids"] = update_data.character_ids
            if update_data.background_description is not None:
                update_dict["background_description"] = update_data.background_description

            if not update_dict:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

            # Update the page
            upd = (
                supabase
                .table("pages")
                .update(update_dict)
                .eq("storybook_id", storybook_id)
                .eq("page_number", page_number)
                .execute()
            )
            updated = (upd.data or [{}])[0]

            # Return updated page content
            return PageContentResponse(
                id=updated.get("id", page_check.data["id"]),
                page_number=page_number,
                script_text=updated.get("script_text"),
                image_url=updated.get("image_url"),
                audio_url=updated.get("audio_url"),
                image_prompt=updated.get("image_prompt"),
                image_style=updated.get("image_style"),
                character_ids=updated.get("character_ids", []),
                background_description=updated.get("background_description"),
                created_at=updated.get("created_at")
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update page content: {e}")


studio_data_service = StudioDataService()


