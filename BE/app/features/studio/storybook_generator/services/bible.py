"""
Story Bible Generation Service

Generates comprehensive story bibles for children's picture books using LLM structured output.
Creates character information, setting details, and story elements based on user input.
"""

import json
import os
from typing import Dict, Any, List
from app.shared.llm.base import Provider, generate_structured
from app.shared.llm.llm_config import DEFAULT_BIBLE_PROVIDER, DEFAULT_BIBLE_MODEL
from app.shared.database.supabase_client import supabase
from ..output_schemas.bible import StoryBibleSchema, SettingOnlySchema, Character


def generate_story_bible(storybook_id: str) -> StoryBibleSchema:
    """
    Generate a story bible for the given storybook.
    
    Args:
        storybook_id: The storybook ID to generate bible for
        
    Returns:
        StoryBibleSchema object containing character, setting, and story information
        
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
        
        # Check for preset characters
        character_ids = creation_params.get("character_ids", [])
        
        if character_ids:
            # === Path 1: Use preset characters ===
            # 1. Fetch preset characters from database
            char_response = supabase.table("characters").select("*").in_("id", character_ids).execute()
            if not char_response.data:
                raise ValueError(f"No characters found for IDs: {character_ids}")
            
            preset_characters = []
            for char_data in char_response.data:
                preset_characters.append(Character(
                    character_name=char_data["character_name"],
                    description=char_data.get("description") or "",
                    visual_features=char_data["visual_features"]
                ))
            
            # 2. Include preset characters in prompt
            preset_info = json.dumps([c.model_dump() for c in preset_characters], ensure_ascii=False)
            prompt_template = _load_prompt_template("bible.md")
            formatted_prompt = prompt_template.replace("{{preset_characters}}", preset_info)
            formatted_prompt = formatted_prompt.replace("{{user_input}}", user_input)
            
            # 3. Generate setting only (using SettingOnlySchema)
            result = generate_structured(
                provider=Provider(DEFAULT_BIBLE_PROVIDER),
                model=DEFAULT_BIBLE_MODEL,
                input_text=formatted_prompt,
                schema=SettingOnlySchema
            )
            setting_only = result.parsed
            
            # 4. Combine preset characters + setting data into StoryBibleSchema
            story_bible = StoryBibleSchema(
                characters=preset_characters,
                name=setting_only.name,
                time_period=setting_only.time_period,
                location_type=setting_only.location_type,
                description=setting_only.description,
                world_rules=setting_only.world_rules,
                main_theme=setting_only.main_theme,
                main_conflict=setting_only.main_conflict,
                conflict_resolution=setting_only.conflict_resolution
            )
        else:
            # === Path 2: Generate complete story bible (existing approach) ===
            prompt_template = _load_prompt_template("bible.md")
            formatted_prompt = prompt_template.replace("{{preset_characters}}", "")
            formatted_prompt = formatted_prompt.replace("{{user_input}}", user_input)
            
            # Generate complete Story Bible (using StoryBibleSchema)
            result = generate_structured(
                provider=Provider(DEFAULT_BIBLE_PROVIDER),
                model=DEFAULT_BIBLE_MODEL,
                input_text=formatted_prompt,
                schema=StoryBibleSchema
            )
            story_bible = result.parsed
        
        # Save the generated bible to creation_params
        updated_creation_params = creation_params.copy()
        updated_creation_params["bible"] = story_bible.model_dump()
        
        # Update the database
        supabase.table("storybooks").update({
            "creation_params": updated_creation_params
        }).eq("id", storybook_id).execute()
        
        return story_bible
        
    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Failed to generate story bible for {storybook_id}: {e}")


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
