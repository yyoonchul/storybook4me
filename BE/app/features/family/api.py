"""
Character API endpoints
Handles HTTP requests for character CRUD operations
"""

from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.features.auth.deps import get_current_user_id
from app.features.family.models import (
    CreateCharacterRequest,
    UpdateCharacterRequest,
    CharacterResponse,
    CharacterListResponse,
    PresetCharactersResponse,
    DeleteResponse
)
from app.features.family.services import character_service

router = APIRouter()


@router.get("", response_model=CharacterListResponse)
async def get_characters(
    current_user_id: str = Depends(get_current_user_id),
    page: Optional[int] = Query(None, ge=1, description="Page number"),
    limit: Optional[int] = Query(None, ge=1, le=100, description="Items per page"),
    include_presets: bool = Query(False, description="Include preset characters")
):
    """Get user's characters with optional pagination."""
    return character_service.get_characters(
        user_id=current_user_id,
        page=page,
        limit=limit,
        include_presets=include_presets
    )


@router.post("", response_model=CharacterResponse)
async def create_character(
    character_data: CreateCharacterRequest,
    current_user_id: str = Depends(get_current_user_id)
):
    """Create a new character."""
    character = character_service.create_character(character_data, current_user_id)
    return CharacterResponse(character=character)


@router.get("/presets", response_model=PresetCharactersResponse)
async def get_preset_characters():
    """Get all preset characters (no authentication required)."""
    return character_service.get_preset_characters()


@router.get("/{character_id}", response_model=CharacterResponse)
async def get_character(
    character_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Get a specific character by ID."""
    character = character_service.get_character(character_id, current_user_id)
    return CharacterResponse(character=character)


@router.put("/{character_id}", response_model=CharacterResponse)
async def update_character(
    character_id: str,
    character_data: UpdateCharacterRequest,
    current_user_id: str = Depends(get_current_user_id)
):
    """Update a specific character."""
    character = character_service.update_character(character_id, character_data, current_user_id)
    return CharacterResponse(character=character)


@router.delete("/{character_id}", response_model=DeleteResponse)
async def delete_character(
    character_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    """Delete a specific character."""
    return character_service.delete_character(character_id, current_user_id)
