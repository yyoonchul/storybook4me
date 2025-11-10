"""
Pydantic models for storybook rewrite requests and responses.
"""

from pydantic import BaseModel, Field

from ..output_schemas.draft import FinalScriptSchema


class RewriteScriptRequest(BaseModel):
    """Request payload for rewriting a full storybook script."""

    script: FinalScriptSchema = Field(
        ...,
        description="Existing storybook script data to rewrite (14 spreads).",
    )
    edit_request: str = Field(
        ...,
        min_length=1,
        description="Instructions describing how the script should be rewritten.",
    )


class RewriteScriptResponse(BaseModel):
    """Response payload containing the rewritten script."""

    script: FinalScriptSchema = Field(
        ...,
        description="Rewritten storybook script following the standard schema.",
    )
