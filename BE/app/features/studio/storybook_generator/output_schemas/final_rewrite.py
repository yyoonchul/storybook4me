"""
Structured output for story rewrites that also includes a change summary.
"""

from pydantic import Field

from .draft import FinalScriptSchema


class FinalRewriteSchema(FinalScriptSchema):
    """Final script with an additional natural-language change summary."""

    change_summary: str = Field(
        ...,
        description=(
            "1-2 sentence summary describing the key changes made to the story. "
            "This will be surfaced to the user in the chat interface."
        ),
    )


