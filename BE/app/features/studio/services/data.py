"""
Service layer for Studio - read/update storybook title and page content.
"""

from fastapi import HTTPException, status
from app.shared.database.supabase_client import supabase
from app.features.storybook.models import Storybook  # reuse comprehensive model if needed
from ..models.data import (
    StorybookTitleResponse, 
    PageContentResponse, 
    PageContentUpdateRequest,
    AddPageRequest,
    AddPageResponse,
    DeletePageResponse
)
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

    def add_page(self, user_id: str, storybook_id: str, page_data: AddPageRequest) -> AddPageResponse:
        """Add a new page to the end of a storybook."""
        try:
            # First verify storybook ownership
            storybook_check = (
                supabase
                .table("storybooks")
                .select("id,user_id,page_count")
                .eq("id", storybook_id)
                .single()
                .execute()
            )
            storybook = storybook_check.data
            if not storybook:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Storybook not found")
            if storybook.get("user_id") != user_id:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

            # Get current page count to determine new page number
            current_page_count = storybook.get("page_count", 0)
            new_page_number = current_page_count + 1

            # Prepare page data
            page_content = page_data.content
            insert_data = {
                "storybook_id": storybook_id,
                "page_number": new_page_number,
                "script_text": page_content.get("script_text"),
                "image_prompt": page_content.get("image_prompt"),
                "image_style": page_content.get("image_style"),
                "character_ids": page_content.get("character_ids", []),
                "background_description": page_content.get("background_description")
            }

            # Insert new page
            res = (
                supabase
                .table("pages")
                .insert(insert_data)
                .execute()
            )
            
            if not res.data:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create page")
            
            new_page = res.data[0]

            # Update storybook page count
            supabase.table("storybooks").update({"page_count": new_page_number}).eq("id", storybook_id).execute()

            # Return the created page
            page_response = PageContentResponse(
                id=new_page["id"],
                page_number=new_page["page_number"],
                script_text=new_page.get("script_text"),
                image_url=new_page.get("image_url"),
                audio_url=new_page.get("audio_url"),
                image_prompt=new_page.get("image_prompt"),
                image_style=new_page.get("image_style"),
                character_ids=new_page.get("character_ids", []),
                background_description=new_page.get("background_description"),
                created_at=new_page["created_at"]
            )

            return AddPageResponse(page=page_response)

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to add page: {e}")

    def delete_page(self, user_id: str, storybook_id: str, page_number: int) -> DeletePageResponse:
        """Delete a specific page from a storybook."""
        try:
            # First verify storybook ownership
            storybook_check = (
                supabase
                .table("storybooks")
                .select("id,user_id,page_count")
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

            # Delete the page
            supabase.table("pages").delete().eq("storybook_id", storybook_id).eq("page_number", page_number).execute()

            # Update page numbers for all pages after the deleted one
            # First, get all pages with page_number > deleted_page_number
            pages_to_update = (
                supabase
                .table("pages")
                .select("id,page_number")
                .eq("storybook_id", storybook_id)
                .gt("page_number", page_number)
                .order("page_number")
                .execute()
            )

            # Update each page's number (decrement by 1)
            for page in pages_to_update.data or []:
                new_page_number = page["page_number"] - 1
                supabase.table("pages").update({"page_number": new_page_number}).eq("id", page["id"]).execute()

            # Update storybook page count
            current_page_count = storybook.get("page_count", 0)
            new_page_count = max(0, current_page_count - 1)
            supabase.table("storybooks").update({"page_count": new_page_count}).eq("id", storybook_id).execute()

            return DeletePageResponse(
                message="Page deleted successfully",
                deleted_page_number=page_number
            )

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to delete page: {e}")


studio_data_service = StudioDataService()


