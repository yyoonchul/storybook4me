from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Character(BaseModel):
    """Character information - compatible with characters table"""
    character_name: str = Field(..., description="Character name")
    description: Optional[str] = Field(None, description="Character description")
    visual_features: Optional[str] = Field(None, description="Visual features for image generation")

class StoryBibleSchema(BaseModel):
    """Character information"""
    characters: List[Character] = Field(..., description="Characters", min_items=1)

    """Background setting"""
    name: str = Field(..., description="Location name")
    time_period: str = Field(..., description="Time period")
    location_type: str = Field(..., description="Location type (e.g., forest, village, house)")
    description: str = Field(..., description="Detailed description of the location")

    """Theme information"""
    world_rules: str = Field(..., description="World rules")
    main_theme: str = Field(..., description="Main theme")
    main_conflict: str = Field(..., description="Main conflict situation")
    conflict_resolution: str = Field(..., description="Conflict resolution direction")

# JSON Schema Example:
"""
{
    "characters": [
        {
            "character_name": "Luna",
            "description": "A brave young girl with silver hair and sparkling eyes",
            "visual_features": "Silver hair, sparkling blue eyes, wears a flowing white dress"
        },
        {
            "character_name": "Shadow",
            "description": "A mysterious black cat who can talk",
            "visual_features": "Jet black fur, glowing green eyes, unusually large size"
        }
    ],
    "name": "The Enchanted Forest",
    "time_period": "Once upon a time",
    "location_type": "Magical forest",
    "description": "A mystical forest filled with ancient trees, glowing mushrooms, and hidden magical creatures",
    "world_rules": "Magic flows through all living things, animals can speak, wishes come true under the full moon",
    "main_theme": "Friendship and courage",
    "main_conflict": "The forest is losing its magic and needs Luna's help to restore it",
    "conflict_resolution": "Luna discovers that sharing kindness and helping others brings back the forest's magic"
}
"""