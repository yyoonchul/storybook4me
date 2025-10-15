"""
Story Arc Generation Service

Generates detailed story arcs following the StoryArcSchema structure using LLM structured output.
Creates 3-act structure and 14-spread structure based on user input and story bible.
"""

import json
import os
from typing import Dict, Any
from app.shared.llm.base import Provider, generate_structured
from app.shared.llm.llm_config import DEFAULT_ARC_PROVIDER, DEFAULT_ARC_MODEL
from app.shared.database.supabase_client import supabase
from ..output_schemas.arc import StoryArcSchema


def generate_story_arc(storybook_id: str) -> StoryArcSchema:
    """
    Generate a story arc for the given storybook.
    
    Args:
        storybook_id: The storybook ID to generate arc for
        
    Returns:
        StoryArcSchema object containing 3-act and 14-spread structure
        
    Raises:
        ValueError: If storybook not found, creation_params missing, or LLM generation fails
    """
    # Input validation
    if not storybook_id:
        raise ValueError("storybook_id must be provided")
    
    try:
        # Fetch storybook from database
        response = supabase.table("storybooks").select("creation_params").eq("id", storybook_id).execute()
        
        if not response.data:
            raise ValueError(f"Storybook with id {storybook_id} not found")
        
        storybook_data = response.data[0]
        creation_params = storybook_data.get("creation_params")
        
        if not creation_params:
            raise ValueError(f"Storybook {storybook_id} has no creation_params")
        
        # Extract prompt from creation_params
        user_input = creation_params.get("prompt", "")
        if not user_input:
            raise ValueError(f"Storybook {storybook_id} has no prompt in creation_params")
        
        # Load and format prompt template
        prompt_template = _load_prompt_template("arc.md")
        formatted_prompt = prompt_template.replace("{{user_input}}", user_input)
        
        # Extract story_bible from creation_params if available
        story_bible_text = ""
        if "bible" in creation_params:
            bible_data = creation_params["bible"]
            # Convert bible data to a readable text format
            story_bible_text = f"Characters: {', '.join([char.get('character_name', '') for char in bible_data.get('characters', [])])}\n"
            story_bible_text += f"Setting: {bible_data.get('name', '')} - {bible_data.get('description', '')}\n"
            story_bible_text += f"Theme: {bible_data.get('main_theme', '')}\n"
            story_bible_text += f"Conflict: {bible_data.get('main_conflict', '')}"
        
        formatted_prompt = formatted_prompt.replace("{{story_bible}}", story_bible_text)
        
        # Generate structured output
        result = generate_structured(
            provider=Provider(DEFAULT_ARC_PROVIDER),
            model=DEFAULT_ARC_MODEL,
            input_text=formatted_prompt,
            schema=StoryArcSchema
        )
        
        story_arc = result.parsed
        
        # Save the generated arc to creation_params
        updated_creation_params = creation_params.copy()
        updated_creation_params["arc"] = story_arc.model_dump()
        
        # Update the database
        supabase.table("storybooks").update({
            "creation_params": updated_creation_params
        }).eq("id", storybook_id).execute()
        
        return story_arc
        
    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Failed to generate story arc for {storybook_id}: {e}")


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
