"""
Image prompt generator for storybook pages.

This module provides functionality to generate image prompts for storybook pages
by combining a system prompt with the page script text.
"""

from typing import List, Dict, Any
from fastapi import HTTPException, status
from app.shared.database.supabase_client import supabase


class ImagePromptGenerator:
    """Generate image prompts for storybook pages."""
    
    def __init__(self):
        self.system_prompt = "Create a fairy tale illustration for the following story script"
    
    def generate_image_prompts_for_storybook(self, storybook_id: str) -> Dict[str, Any]:
        """
        Generate image prompts for all pages in a storybook.
        
        Args:
            storybook_id (str): The ID of the storybook
            
        Returns:
            Dict[str, Any]: Result containing updated page count and details
            
        Raises:
            HTTPException: If storybook not found or database error occurs
        """
        try:
            # First, verify that the storybook exists
            storybook_check = (
                supabase
                .table("storybooks")
                .select("id,title,page_count")
                .eq("id", storybook_id)
                .execute()
            )
            
            if not storybook_check.data or len(storybook_check.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Storybook not found"
                )
            
            storybook = storybook_check.data[0]
            
            # Get all pages for this storybook
            pages_res = (
                supabase
                .table("pages")
                .select("id,page_number,script_text")
                .eq("storybook_id", storybook_id)
                .order("page_number")
                .execute()
            )
            
            if not pages_res.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No pages found for this storybook"
                )
            
            pages = pages_res.data
            updated_count = 0
            failed_updates = []
            
            # Process each page
            for page in pages:
                page_id = page["id"]
                page_number = page["page_number"]
                script_text = page.get("script_text")
                
                if not script_text or script_text.strip() == "":
                    failed_updates.append({
                        "page_number": page_number,
                        "reason": "Empty or missing script text"
                    })
                    continue
                
                # Generate image prompt
                image_prompt = self._create_image_prompt(script_text)
                
                # Update the page with the generated image prompt
                update_res = (
                    supabase
                    .table("pages")
                    .update({"image_prompt": image_prompt})
                    .eq("id", page_id)
                    .execute()
                )
                
                if update_res.data:
                    updated_count += 1
                else:
                    failed_updates.append({
                        "page_number": page_number,
                        "reason": "Failed to update database"
                    })
            
            return {
                "storybook_id": storybook_id,
                "storybook_title": storybook.get("title", ""),
                "total_pages": len(pages),
                "updated_pages": updated_count,
                "failed_updates": failed_updates,
                "message": f"Successfully generated image prompts for {updated_count} out of {len(pages)} pages"
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate image prompts: {str(e)}"
            )
    
    def _create_image_prompt(self, script_text: str) -> str:
        """
        Create an image prompt by combining system prompt with script text.
        
        Args:
            script_text (str): The page script text
            
        Returns:
            str: Combined image prompt
        """
        # Clean up the script text
        cleaned_script = script_text.strip()
        
        # Combine system prompt with script text
        image_prompt = f"{self.system_prompt}: {cleaned_script}"
        
        return image_prompt
    


# Create a singleton instance
image_prompt_generator = ImagePromptGenerator()
