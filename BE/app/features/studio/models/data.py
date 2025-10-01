"""
Pydantic models for Studio feature (title fetch/update).

This focuses on minimal models to read and update the `title` column of the
`storybooks` table as defined in .cursor/DBTABLES.md.
"""

from pydantic import BaseModel, Field


class StorybookTitleResponse(BaseModel):
    id: str = Field(description="Storybook ID (UUID)")
    title: str = Field(description="Storybook title from DB")


class StorybookTitleUpdateRequest(BaseModel):
    title: str = Field(min_length=1, description="New title to set")


class MessageResponse(BaseModel):
    message: str


