"""
Final Script Generation Service

Generates the final script for children's picture books using LLM structured output.
Creates 14 spreads with complete story following the FinalScriptSchema structure.
"""

import json
import os
from typing import Dict, Any
from app.shared.llm.base import Provider, generate_structured
from app.shared.llm.llm_config import DEFAULT_DRAFT_PROVIDER, DEFAULT_DRAFT_MODEL
from app.shared.database.supabase_client import supabase
from ..output_schemas.draft import FinalScriptSchema
from .utils import get_characters_for_spread


def generate_final_script(storybook_id: str) -> FinalScriptSchema:
    """
    Generate the final script for the given storybook.
    
    Args:
        storybook_id: The storybook ID to generate script for
        
    Returns:
        FinalScriptSchema object containing 14 spreads with complete story
        
    Raises:
        ValueError: If storybook not found, creation_params missing, or LLM generation fails
    """
    # Input validation
    if not storybook_id:
        raise ValueError("storybook_id must be provided")
    
    try:
        # Fetch storybook from database
        response = supabase.table("storybooks").select("creation_params, user_id").eq("id", storybook_id).execute()
        
        if not response.data:
            raise ValueError(f"Storybook with id {storybook_id} not found")
        
        storybook_data = response.data[0]
        creation_params = storybook_data.get("creation_params")
        user_id = storybook_data.get("user_id")
        
        if not creation_params:
            raise ValueError(f"Storybook {storybook_id} has no creation_params")
        
        if not user_id:
            raise ValueError(f"Storybook {storybook_id} has no user_id")
        
        # Extract prompt from creation_params
        user_input = creation_params.get("prompt", "")
        if not user_input:
            raise ValueError(f"Storybook {storybook_id} has no prompt in creation_params")
        
        # Load and format prompt template
        prompt_template = _load_prompt_template("draft.md")
        formatted_prompt = prompt_template.replace("{{user_input}}", user_input)
        
        # Extract story_bible and story_arc from creation_params if available
        story_bible_text = ""
        if "bible" in creation_params:
            bible_data = creation_params["bible"]
            story_bible_text = f"Characters: {', '.join([char.get('character_name', '') for char in bible_data.get('characters', [])])}\n"
            story_bible_text += f"Setting: {bible_data.get('name', '')} - {bible_data.get('description', '')}\n"
            story_bible_text += f"Theme: {bible_data.get('main_theme', '')}\n"
            story_bible_text += f"Conflict: {bible_data.get('main_conflict', '')}"
        
        story_arc_text = ""
        if "arc" in creation_params:
            arc_data = creation_params["arc"]
            story_arc_text = f"3-Act Structure:\n"
            for act in arc_data.get('acts', []):
                story_arc_text += f"Act {act.get('act_number', '')}: {act.get('act_name', '')} - {act.get('description', '')}\n"
            story_arc_text += f"\n14-Spread Structure:\n"
            for spread in arc_data.get('spreads', []):
                story_arc_text += f"Spread {spread.get('spread_number', '')}: {spread.get('description', '')}\n"
        
        formatted_prompt = formatted_prompt.replace("{{story_bible}}", story_bible_text)
        formatted_prompt = formatted_prompt.replace("{{story_arc}}", story_arc_text)
        
        # Get page-specific character information for each spread
        page_specific_characters_text = _build_page_specific_characters_text(storybook_id)
        formatted_prompt = formatted_prompt.replace("{{page_specific_characters}}", page_specific_characters_text)
        
        # Generate structured output
        result = generate_structured(
            provider=Provider(DEFAULT_DRAFT_PROVIDER),
            model=DEFAULT_DRAFT_MODEL,
            input_text=formatted_prompt,
            schema=FinalScriptSchema
        )
        
        # Set storybook_id and user_id from database
        final_script = result.parsed
        final_script.storybook_id = storybook_id
        final_script.user_id = user_id
        
        return final_script
        
    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Failed to generate final script for {storybook_id}: {e}")


def _build_page_specific_characters_text(storybook_id: str) -> str:
    """
    Build text describing page-specific characters for each spread.
    
    Args:
        storybook_id: The storybook ID
        
    Returns:
        Formatted text with spread-specific character information
    """
    spread_characters_text = []
    
    for spread_number in range(1, 15):  # Spreads 1-14
        characters = get_characters_for_spread(storybook_id, spread_number)
        
        if characters:
            char_names = [char.character_name for char in characters]
            char_descriptions = []
            for char in characters:
                desc = f"{char.character_name}"
                if char.description:
                    desc += f": {char.description}"
                char_descriptions.append(desc)
            
            spread_characters_text.append(
                f"Spread {spread_number}: {', '.join(char_names)}\n"
                f"  Character details: {'; '.join(char_descriptions)}"
            )
    
    if spread_characters_text:
        return "\n".join(spread_characters_text)
    else:
        return "No page-specific character information available. Use storybook-level characters from the Story Bible."


def _load_prompt_template(template_name: str) -> str:
    """Load prompt template from prompts directory."""
    current_dir = os.path.dirname(__file__)
    prompts_dir = os.path.join(current_dir, "..", "prompts")
    template_path = os.path.join(prompts_dir, template_name)
    
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise ValueError(f"Prompt template {template_name} not found in {prompts_dir}")
    except Exception as e:
        raise ValueError(f"Failed to load prompt template {template_name}: {e}")
