"""Pydantic models for the Studio chat endpoint."""

from typing import Optional

from pydantic import BaseModel, Field

from ..output_schemas.draft import FinalScriptSchema


class ChatRequest(BaseModel):
    """Incoming chat message paired with the current story script."""

    script: FinalScriptSchema = Field(
        ..., description="Current story script (14 spreads) scoped to the user."
    )
    message: str = Field(
        ..., min_length=1, description="User's chat message or rewrite request."
    )


class ChatResponse(BaseModel):
    """Response returned to the Studio chat client."""

    assistant_message: str = Field(
        ..., description="Assistant's reply summarising the answer or changes applied."
    )
    script: Optional[FinalScriptSchema] = Field(
        None,
        description="Updated story script when a rewrite was requested. Present only for edit actions.",
    )


