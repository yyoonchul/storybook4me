"""
Pydantic models for Studio feature (title fetch/update and page content management).

This focuses on minimal models to read and update the `title` column of the
`storybooks` table and page content from the `pages` table as defined in .cursor/DBTABLES.md.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class StorybookTitleResponse(BaseModel):
    id: str = Field(description="Storybook ID (UUID)")
    title: str = Field(description="Storybook title from DB")


class StorybookTitleUpdateRequest(BaseModel):
    title: str = Field(min_length=1, description="New title to set")


class PageContentResponse(BaseModel):
    id: str = Field(description="Page ID (UUID)")
    page_number: int = Field(description="Page number in the storybook")
    script_text: Optional[str] = Field(description="Page text content")
    image_url: Optional[str] = Field(description="Page image URL")
    audio_url: Optional[str] = Field(description="TTS audio URL")
    image_prompt: Optional[str] = Field(description="Image generation prompt")
    image_style: Optional[str] = Field(description="Image style")
    character_ids: Optional[List[str]] = Field(description="Character IDs appearing in this page")
    background_description: Optional[str] = Field(description="Background description")
    created_at: datetime = Field(description="Page creation timestamp")


class PageContentUpdateRequest(BaseModel):
    # NOTE: In Pydantic v2, Optional[...] without a default is still a required field.
    # To make these fields truly optional (omittable), we must set default=None.
    script_text: Optional[str] = Field(default=None, description="Updated page text content")
    image_prompt: Optional[str] = Field(default=None, description="Updated image generation prompt")
    image_style: Optional[str] = Field(default=None, description="Updated image style")
    character_ids: Optional[List[str]] = Field(default=None, description="Updated character IDs")
    background_description: Optional[str] = Field(default=None, description="Updated background description")


class MessageResponse(BaseModel):
    message: str


