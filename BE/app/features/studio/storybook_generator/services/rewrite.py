"""
Storybook Rewrite Service

Provides text editing capabilities for children's picture books using LLM text generation.
Supports both plain text editing and full script rewriting with proper formatting.
"""

from typing import Dict, List, Optional

from app.shared.llm.base import Provider, generate_structured, generate_text
from app.shared.llm.llm_config import DEFAULT_REWRITE_PROVIDER, DEFAULT_REWRITE_MODEL

from ..output_schemas.draft import FinalScriptSchema
from ..output_schemas.final_rewrite import FinalRewriteSchema
from .utils import get_characters_for_page, get_characters_for_spread


# System Prompts
PLAIN_TEXT_REWRITE_PROMPT = """You are an expert editor for children's picture books (ages 4-5).

Your task is to edit the original text according to the user's request.

Guidelines:
- Maintain simple, clear language appropriate for 4-5 year olds
- Use active voice and short sentences
- Keep the read-aloud rhythm and flow
- Preserve the original tone and style unless specifically requested to change
- Apply only the requested edits
- Consider the characters appearing in this page when editing

{character_context}

Original Text:
{original_text}

User's Request:
{edit_request}

Provide only the edited text without explanations."""


FULL_SCRIPT_REWRITE_PROMPT = """You are an expert editor for children's picture books (ages 4-5).

Your task is to edit the original script according to the user's request.

Context:
- Format: 14 spreads (28 pages total)
- Each spread has script_1 (left page) and script_2 (right page)
- Target: 500-650 words total
- Age-appropriate vocabulary for 4-5 year olds

Guidelines:
- Maintain story structure and 3-act progression
- Keep simple sentences and active voice
- Preserve page turn strategy (script_2 should create anticipation)
- Use repetition and rhythm for read-aloud flow
- Apply the requested edits while maintaining coherence across all spreads

Current Script:
{formatted_spreads}

User's Request:
{edit_request}

Provide the edited script following the FinalScriptSchema structure with storybook_id and user_id from the original script."""

FULL_SCRIPT_REWRITE_WITH_SUMMARY_PROMPT = """You are an expert editor for children's picture books (ages 4-5).

Your task is to edit the original script according to the user's request.

Context:
- Format: 14 spreads (28 pages total)
- Each spread has script_1 (left page) and script_2 (right page)
- Target: 500-650 words total
- Age-appropriate vocabulary for 4-5 year olds

Guidelines:
- Maintain story structure and 3-act progression
- Keep simple sentences and active voice
- Preserve page turn strategy (script_2 should create anticipation)
- Use repetition and rhythm for read-aloud flow
- Apply the requested edits while maintaining coherence across all spreads
- Consider the characters appearing in each spread when editing

{character_context}

Current Script:
{formatted_spreads}

User's Request:
{edit_request}

Return a JSON object that matches the FinalRewriteSchema structure:
- storybook_id: copy from the original script
- user_id: copy from the original script
- spreads: 14 spread objects (script_1/script_2) reflecting the requested changes
- change_summary: 1-2 sentences summarising the key changes for the user in friendly language.
"""


def rewrite_plain_text(
    original_text: str,
    edit_request: str,
    page_id: Optional[str] = None,
    storybook_id: Optional[str] = None,
    user_id: Optional[str] = None,
) -> str:
    """
    Rewrite plain text based on user's edit request.
    
    Args:
        original_text: The original text to be edited
        edit_request: User's specific edit instructions
        page_id: Optional page ID to get page-specific characters
        storybook_id: Optional storybook ID (required if page_id is provided)
        
    Returns:
        The edited text
        
    Raises:
        ValueError: If LLM generation fails or inputs are invalid
    """
    # Input validation
    if not original_text or not edit_request:
        raise ValueError("Both original_text and edit_request must be non-empty strings")
    
    if page_id and not storybook_id:
        raise ValueError("storybook_id must be provided when page_id is provided")
    
    try:
        # Get character context if page_id is provided
        character_context = ""
        if page_id and storybook_id:
            characters = get_characters_for_page(page_id, storybook_id)
            if characters:
                char_descriptions = []
                for char in characters:
                    desc = f"{char.character_name}"
                    if char.description:
                        desc += f": {char.description}"
                    char_descriptions.append(desc)
                character_context = f"Characters in this page: {'; '.join(char_descriptions)}"
            else:
                character_context = "No specific character information available for this page."
        else:
            character_context = "Character information not available."
        
        # Format the prompt
        prompt = PLAIN_TEXT_REWRITE_PROMPT.format(
            character_context=character_context,
            original_text=original_text,
            edit_request=edit_request
        )
        
        # Generate edited text using LLM
        result = generate_text(
            provider=Provider(DEFAULT_REWRITE_PROVIDER),
            model=DEFAULT_REWRITE_MODEL,
            input_text=prompt,
            user_id=user_id,
            usage_metadata={
                "storybook_id": storybook_id,
                "page_id": page_id,
                "service": "studio.rewrite.plain_text",
            },
        )
        
        return result.text or original_text
        
    except Exception as e:
        raise ValueError(f"Failed to rewrite text: {e}")


def rewrite_full_script(
    script_data: Dict,
    edit_request: str,
    requesting_user_id: Optional[str] = None,
) -> Dict:
    """
    Backwards-compatible wrapper that returns only the rewritten script.
    """
    rewrite_result = rewrite_full_script_with_summary(
        script_data,
        edit_request,
        requesting_user_id=requesting_user_id,
    )
    return rewrite_result.model_dump(exclude={"change_summary"})


def rewrite_full_script_with_summary(
    script_data: Dict,
    edit_request: str,
    requesting_user_id: Optional[str] = None,
) -> FinalRewriteSchema:
    """
    Rewrite the entire storybook script and provide a natural-language change summary.
    """
    spreads = _validate_script_inputs(script_data, edit_request)
    storybook_id = script_data["storybook_id"]

    try:
        formatted_spreads = _format_spreads_for_prompt(spreads)
        
        # Get character context for each spread
        character_context = _build_spread_character_context(storybook_id, spreads)
        
        prompt = FULL_SCRIPT_REWRITE_WITH_SUMMARY_PROMPT.format(
            character_context=character_context,
            formatted_spreads=formatted_spreads,
            edit_request=edit_request,
        )
        billing_user_id = requesting_user_id or script_data.get("user_id")
        result = generate_structured(
            provider=Provider(DEFAULT_REWRITE_PROVIDER),
            model=DEFAULT_REWRITE_MODEL,
            input_text=prompt,
            schema=FinalRewriteSchema,
            user_id=billing_user_id,
            usage_metadata={
                "storybook_id": storybook_id,
                "service": "studio.rewrite.full_script",
            },
        )
        parsed: FinalRewriteSchema = result.parsed
        # Ensure identifiers remain consistent with the source script.
        parsed.storybook_id = script_data["storybook_id"]
        parsed.user_id = script_data["user_id"]
        return parsed
    except Exception as e:
        raise ValueError(f"Failed to rewrite script with summary: {e}")


def _build_spread_character_context(storybook_id: str, spreads: List[Dict]) -> str:
    """Build character context for each spread."""
    character_contexts = []
    
    for spread in spreads:
        spread_number = spread.get("spread_number")
        if spread_number:
            characters = get_characters_for_spread(storybook_id, spread_number)
            if characters:
                char_names = [char.character_name for char in characters]
                char_descriptions = []
                for char in characters:
                    desc = f"{char.character_name}"
                    if char.description:
                        desc += f": {char.description}"
                    char_descriptions.append(desc)
                character_contexts.append(
                    f"Spread {spread_number} characters: {', '.join(char_names)}\n"
                    f"  Details: {'; '.join(char_descriptions)}"
                )
    
    if character_contexts:
        return "Character Information by Spread:\n" + "\n".join(character_contexts)
    else:
        return "No page-specific character information available. Use storybook-level characters."


def _format_spreads_for_prompt(spreads: List[Dict]) -> str:
    """Format spreads into readable text for the LLM prompt."""
    formatted = []
    
    for spread in spreads:
        spread_text = f"Spread {spread['spread_number']}:\n"
        spread_text += f"  Left Page (script_1): {spread['script_1']}\n"
        spread_text += f"  Right Page (script_2): {spread['script_2']}\n"
        formatted.append(spread_text)
    
    return "\n".join(formatted)


def _validate_script_inputs(script_data: Dict, edit_request: str) -> List[Dict]:
    """Validate the script payload before sending it to the LLM."""
    if not script_data or not isinstance(script_data, dict):
        raise ValueError("script_data must be a dictionary containing story information")
    if not edit_request:
        raise ValueError("edit_request must be provided")

    for key in ("storybook_id", "user_id", "spreads"):
        if key not in script_data:
            raise ValueError(f"script_data missing required key: {key}")

    spreads = script_data["spreads"]
    if not isinstance(spreads, list) or len(spreads) != 14:
        raise ValueError("Script must contain exactly 14 spreads")

    for i, spread in enumerate(spreads):
        if not isinstance(spread, dict):
            raise ValueError(f"Spread {i + 1} must be a dictionary")
        for key in ("spread_number", "script_1", "script_2"):
            if key not in spread:
                raise ValueError(f"Spread {i + 1} missing required key: {key}")

    return spreads

