"""
Pydantic models related to chat message classification.
"""

from typing import Literal

from pydantic import BaseModel, Field


class ClassificationSchema(BaseModel):
    """Structured output for classifying chat messages."""

    action: Literal["edit", "question"] = Field(
        ...,
        description="`edit` when the user asks to modify or rewrite the story, otherwise `question`.",
    )



