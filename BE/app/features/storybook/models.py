"""
Pydantic models for Storybook feature (aligned with DBTABLES.md).
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


class StorybookStatus(str, Enum):
    """Pipeline status for storybook generation.

    Order (typical flow):
    pending -> script_generating -> script_generated -> images_generating -> assembling -> complete
    Error/stop: failed, canceled
    """

    pending = "pending"
    script_generating = "script_generating"
    script_generated = "script_generated"
    images_generating = "images_generating"
    assembling = "assembling"
    complete = "complete"
    failed = "failed"
    canceled = "canceled"


class Storybook(BaseModel):
    id: str
    user_id: str
    title: str
    cover_image_url: Optional[str] = None
    status: StorybookStatus
    is_public: bool
    created_at: str
    updated_at: Optional[str] = None
    page_count: int
    like_count: Optional[int] = 0
    view_count: Optional[int] = 0
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    character_ids: Optional[List[str]] = None
    creation_params: Optional[Dict[str, Any]] = None
    # Expanded field for detail response
    pages: Optional[List["Page"]] = None


class StorybookSummary(BaseModel):
    id: str
    title: str
    cover_image_url: Optional[str] = None
    status: StorybookStatus
    is_public: bool
    created_at: str
    page_count: int
    like_count: Optional[int] = 0
    view_count: Optional[int] = 0


class StorybookListResponse(BaseModel):
    storybooks: List[StorybookSummary]
    total: int
    page: int
    limit: int


class StorybookResponse(BaseModel):
    storybook: Storybook


class Page(BaseModel):
    id: str
    storybook_id: str
    page_number: int
    script_text: Optional[str] = None
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    image_prompt: Optional[str] = None
    image_style: Optional[str] = None
    character_ids: Optional[List[str]] = None
    background_description: Optional[str] = None
    created_at: Optional[str] = None


class CreateStorybookRequest(BaseModel):
    title: str
    character_ids: Optional[List[str]] = Field(default=None, alias="characterIds")
    theme: Optional[str] = None
    style: Optional[str] = None
    page_count: Optional[int] = Field(default=None, alias="pageCount")
    prompt: Optional[str] = None

    class Config:
        populate_by_name = True


class UpdateStorybookRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None


class UpdateVisibilityRequest(BaseModel):
    is_public: bool = Field(alias="isPublic")

    class Config:
        populate_by_name = True


class DeleteResponse(BaseModel):
    message: str

