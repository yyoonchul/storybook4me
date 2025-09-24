"""
Character service layer for business logic
Handles CRUD operations for characters with proper validation and RLS
"""

from typing import List, Optional
from fastapi import HTTPException, status
from app.shared.database.supabase_client import supabase
from app.features.family.models import (
    Character,
    CreateCharacterRequest,
    UpdateCharacterRequest,
    CharacterListResponse,
    PresetCharactersResponse,
    DeleteResponse
)
import logging

logger = logging.getLogger("family.services")


class CharacterService:
    """Service class for character operations."""

    def get_characters(
        self, 
        user_id: str, 
        page: Optional[int] = None, 
        limit: Optional[int] = None,
        include_presets: bool = False
    ) -> CharacterListResponse:
        """Get user's characters with optional pagination."""
        try:
            query = supabase.table("characters").select("*")
            
            if include_presets:
                # User's characters + presets
                query = query.or_(f"user_id.eq.{user_id},is_preset.eq.true")
            else:
                # Only user's characters
                query = query.eq("user_id", user_id)
            
            # Add ordering
            query = query.order("created_at", desc=True)
            
            # Add pagination if provided
            if page is not None and limit is not None:
                offset = (page - 1) * limit
                query = query.range(offset, offset + limit - 1)
            
            response = query.execute()
            characters_data = response.data or []
            
            # Get total count for pagination
            count_response = supabase.table("characters").select("id", count="exact")
            if include_presets:
                count_response = count_response.or_(f"user_id.eq.{user_id},is_preset.eq.true")
            else:
                count_response = count_response.eq("user_id", user_id)
            
            count_result = count_response.execute()
            total = count_result.count or 0
            
            characters = [Character(**char) for char in characters_data]
            
            logger.debug("Retrieved %d characters for user %s", len(characters), user_id)
            
            return CharacterListResponse(
                characters=characters,
                total=total,
                page=page,
                limit=limit
            )
            
        except Exception as e:
            logger.error("Failed to get characters for user %s: %s", user_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve characters: {str(e)}"
            )

    def get_character(self, character_id: str, user_id: str) -> Character:
        """Get a specific character by ID."""
        try:
            response = supabase.table("characters").select("*").eq("id", character_id).single().execute()
            
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Character not found"
                )
            
            character_data = response.data
            character = Character(**character_data)
            
            # Check ownership (user's character or preset)
            if character.user_id != user_id and not character.is_preset:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this character"
                )
            
            logger.debug("Retrieved character %s for user %s", character_id, user_id)
            return character
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to get character %s: %s", character_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve character: {str(e)}"
            )

    def create_character(self, character_data: CreateCharacterRequest, user_id: str) -> Character:
        """Create a new character."""
        try:
            # Prepare character data for insertion
            insert_data = {
                "user_id": user_id,
                "character_name": character_data.character_name,
                "description": character_data.description,
                "visual_features": character_data.visual_features,
                "image_url": character_data.image_url,
                "personality_traits": character_data.personality_traits,
                "likes": character_data.likes,
                "additional_info": character_data.additional_info,
                "is_preset": False  # User-created characters are never presets
            }
            
            # Supabase Python v2: insert().execute() returns a list in data
            response = supabase.table("characters").insert(insert_data).execute()

            if not response.data or not isinstance(response.data, list):
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create character"
                )
            
            created_row = response.data[0]
            character = Character(**created_row)
            logger.info("Created character %s for user %s", character.id, user_id)
            return character
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to create character for user %s: %s", user_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create character: {str(e)}"
            )

    def update_character(
        self, 
        character_id: str, 
        character_data: UpdateCharacterRequest, 
        user_id: str
    ) -> Character:
        """Update an existing character."""
        try:
            # First check if character exists and user owns it
            existing_char = self.get_character(character_id, user_id)
            
            if existing_char.is_preset:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Cannot modify preset characters"
                )
            
            if existing_char.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this character"
                )
            
            # Prepare update data (only include non-None fields)
            update_data = {}
            for field, value in character_data.dict(exclude_unset=True).items():
                if value is not None:
                    update_data[field] = value
            
            if not update_data:
                # No fields to update, return existing character
                return existing_char
            
            response = supabase.table("characters").update(update_data).eq("id", character_id).select().single().execute()
            
            if not response.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update character"
                )
            
            character = Character(**response.data)
            logger.info("Updated character %s for user %s", character_id, user_id)
            return character
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to update character %s: %s", character_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update character: {str(e)}"
            )

    def delete_character(self, character_id: str, user_id: str) -> DeleteResponse:
        """Delete a character."""
        try:
            # First check if character exists and user owns it
            existing_char = self.get_character(character_id, user_id)
            
            if existing_char.is_preset:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Cannot delete preset characters"
                )
            
            if existing_char.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this character"
                )
            
            response = supabase.table("characters").delete().eq("id", character_id).execute()
            
            logger.info("Deleted character %s for user %s", character_id, user_id)
            return DeleteResponse(
                message="Character deleted successfully",
                deleted_id=character_id
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to delete character %s: %s", character_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete character: {str(e)}"
            )

    def get_preset_characters(self) -> PresetCharactersResponse:
        """Get all preset characters."""
        try:
            response = supabase.table("characters").select("*").eq("is_preset", True).order("character_name").execute()
            
            characters_data = response.data or []
            presets = [Character(**char) for char in characters_data]
            
            logger.debug("Retrieved %d preset characters", len(presets))
            return PresetCharactersResponse(presets=presets)
            
        except Exception as e:
            logger.error("Failed to get preset characters: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve preset characters: {str(e)}"
            )


# Global service instance
character_service = CharacterService()
