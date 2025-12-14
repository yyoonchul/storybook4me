"""
Utility functions for storybook generation services
"""

from typing import List, Optional, Tuple
from app.shared.database.supabase_client import supabase
from ..output_schemas.bible import Character


def get_characters_for_page(page_id: str, storybook_id: str) -> List[Character]:
    """
    Get characters for a specific page.
    
    Priority:
    1. Page-level character_ids → fetch from characters table
    2. Fallback: storybook-level bible characters
    
    Args:
        page_id: The page ID to get characters for
        storybook_id: The storybook ID (for fallback to bible)
        
    Returns:
        List of Character objects
    """
    try:
        # 1. Fetch page data to get character_ids
        page_response = supabase.table("pages").select("character_ids").eq("id", page_id).single().execute()
        
        if not page_response.data:
            # Page not found, fallback to storybook bible
            return _get_storybook_bible_characters(storybook_id)
        
        page_data = page_response.data
        character_ids = page_data.get("character_ids")
        
        # 2. If page has character_ids, fetch from characters table
        if character_ids and len(character_ids) > 0:
            char_response = supabase.table("characters").select("*").in_("id", character_ids).execute()
            
            if char_response.data and len(char_response.data) > 0:
                # Convert to Character model
                characters = []
                for char_data in char_response.data:
                    characters.append(Character(
                        character_name=char_data["character_name"],
                        description=char_data.get("description") or "",
                        visual_features=char_data.get("visual_features") or ""
                    ))
                return characters
        
        # 3. Fallback to storybook-level bible characters
        return _get_storybook_bible_characters(storybook_id)
        
    except Exception as e:
        # On any error, fallback to storybook bible
        return _get_storybook_bible_characters(storybook_id)


def _get_storybook_bible_characters(storybook_id: str) -> List[Character]:
    """
    Get characters from storybook-level bible as fallback.
    
    Args:
        storybook_id: The storybook ID
        
    Returns:
        List of Character objects from bible, or empty list if not found
    """
    try:
        # Fetch storybook creation_params
        response = supabase.table("storybooks").select("creation_params").eq("id", storybook_id).single().execute()
        
        if not response.data:
            return []
        
        storybook_data = response.data
        creation_params = storybook_data.get("creation_params")
        
        if not creation_params:
            return []
        
        bible_data = creation_params.get("bible")
        if not bible_data:
            return []
        
        characters_data = bible_data.get("characters", [])
        if not characters_data:
            return []
        
        # Convert to Character model
        characters = []
        for char_data in characters_data:
            characters.append(Character(
                character_name=char_data.get("character_name", ""),
                description=char_data.get("description", ""),
                visual_features=char_data.get("visual_features", "")
            ))
        
        return characters
        
    except Exception:
        return []


def get_page_ids_for_spread(storybook_id: str, spread_number: int) -> Tuple[Optional[str], Optional[str]]:
    """
    Get page IDs for a specific spread.
    
    A spread contains 2 pages:
    - Left page (script_1): page_number = (spread_number - 1) * 2
    - Right page (script_2): page_number = (spread_number - 1) * 2 + 1
    
    Args:
        storybook_id: The storybook ID
        spread_number: The spread number (1-14)
        
    Returns:
        Tuple of (left_page_id, right_page_id), or (None, None) if not found
    """
    try:
        # Calculate page numbers (0-based indexing)
        left_page_number = (spread_number - 1) * 2
        right_page_number = left_page_number + 1
        
        # Fetch pages
        pages_response = supabase.table("pages").select("id, page_number").eq("storybook_id", storybook_id).in_("page_number", [left_page_number, right_page_number]).execute()
        
        if not pages_response.data:
            return (None, None)
        
        # Map page numbers to IDs
        page_map = {page["page_number"]: page["id"] for page in pages_response.data}
        
        left_page_id = page_map.get(left_page_number)
        right_page_id = page_map.get(right_page_number)
        
        return (left_page_id, right_page_id)
        
    except Exception:
        return (None, None)


def get_characters_for_spread(storybook_id: str, spread_number: int) -> List[Character]:
    """
    Get characters for a specific spread by combining characters from both pages.
    
    Args:
        storybook_id: The storybook ID
        spread_number: The spread number (1-14)
        
    Returns:
        List of Character objects (deduplicated by character_name)
    """
    left_page_id, right_page_id = get_page_ids_for_spread(storybook_id, spread_number)
    
    # Get characters from both pages
    all_characters = []
    character_names_seen = set()
    
    if left_page_id:
        left_chars = get_characters_for_page(left_page_id, storybook_id)
        for char in left_chars:
            if char.character_name not in character_names_seen:
                all_characters.append(char)
                character_names_seen.add(char.character_name)
    
    if right_page_id:
        right_chars = get_characters_for_page(right_page_id, storybook_id)
        for char in right_chars:
            if char.character_name not in character_names_seen:
                all_characters.append(char)
                character_names_seen.add(char.character_name)
    
    # If no page-specific characters found, fallback to storybook bible
    if not all_characters:
        return _get_storybook_bible_characters(storybook_id)
    
    return all_characters

