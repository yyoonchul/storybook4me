"""
Request model for Studio storybook generation.
"""

from typing import List, Optional

from pydantic import BaseModel, Field


class GenerateStorybookRequest(BaseModel):
    """Payload to generate a new storybook from Studio settings."""

    title: Optional[str] = Field(default=None, description="Storybook title")
    prompt: str = Field(description="Main concept or prompt for the storybook")
    character_ids: List[str] = Field(
        default_factory=list,
        description="Selected character IDs",
        alias="characterIds",
    )
    style: Optional[str] = Field(default=None, description="Art style or tone")
    theme: Optional[str] = Field(default=None, description="Story theme")
    page_count: Optional[int] = Field(
        default=None,
        description="Desired page count. If omitted, it will be set to the generated page total.",
        alias="pageCount",
    )

    class Config:
        populate_by_name = True








