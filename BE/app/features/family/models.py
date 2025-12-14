"""
Character models for the Family feature
Based on the characters table schema from DBTABLES.md
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


class CharacterBase(BaseModel):
    """Base character model with common fields."""
    character_name: str = Field(..., description="캐릭터 이름")
    description: Optional[str] = Field(None, description="캐릭터 설명")
    visual_features: Optional[str] = Field(None, description="외모 정보 (이미지 생성용)")
    image_url: Optional[str] = Field(None, description="캐릭터 이미지 URL")
    personality_traits: Optional[List[str]] = Field(None, description="성격 특성 배열")
    likes: Optional[List[str]] = Field(None, description="취향 배열")
    additional_info: Optional[Dict[str, Any]] = Field(None, description="추가 정보 (나이, 대명사 등)")


class CreateCharacterRequest(CharacterBase):
    """Request model for creating a new character."""
    pass


class UpdateCharacterRequest(BaseModel):
    """Request model for updating a character."""
    character_name: Optional[str] = Field(None, description="캐릭터 이름")
    description: Optional[str] = Field(None, description="캐릭터 설명")
    visual_features: Optional[str] = Field(None, description="외모 정보 (이미지 생성용)")
    image_url: Optional[str] = Field(None, description="캐릭터 이미지 URL")
    personality_traits: Optional[List[str]] = Field(None, description="성격 특성 배열")
    likes: Optional[List[str]] = Field(None, description="취향 배열")
    additional_info: Optional[Dict[str, Any]] = Field(None, description="추가 정보 (나이, 대명사 등)")


class Character(CharacterBase):
    """Complete character model with all database fields."""
    id: str = Field(..., description="캐릭터 고유 ID (UUID)")
    user_id: str = Field(..., description="소유자 ID (Clerk sub)")
    is_preset: bool = Field(..., description="프리셋 캐릭터 여부")
    created_at: datetime = Field(..., description="생성 시간")
    updated_at: datetime = Field(..., description="수정 시간")

    class Config:
        from_attributes = True


class CharacterResponse(BaseModel):
    """Response model for single character."""
    character: Character


class CharacterListResponse(BaseModel):
    """Response model for character list."""
    characters: List[Character]
    total: int
    page: Optional[int] = None
    limit: Optional[int] = None


class PresetCharactersResponse(BaseModel):
    """Response model for preset characters."""
    presets: List[Character]


class DeleteResponse(BaseModel):
    """Response model for delete operations."""
    message: str
    deleted_id: str
