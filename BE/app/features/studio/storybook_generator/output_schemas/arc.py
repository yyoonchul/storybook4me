from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class Arc(BaseModel):
    """3-Act Structure Arc"""
    model_config = ConfigDict(
        json_schema_extra={
            "additionalProperties": False
        }
    )
    act_number: int = Field(..., description="Act number (1, 2, 3)")
    act_name: str = Field(..., description="Act name")
    description: str = Field(..., description="Act description")

class Spread(BaseModel):
    """14-Spread Structure"""
    model_config = ConfigDict(
        json_schema_extra={
            "additionalProperties": False
        }
    )
    spread_number: int = Field(..., description="Spread number (1-14)")
    description: str = Field(..., description="Spread description")
    act_number: int = Field(..., description="Which act this spread belongs to")

class ThreeActStructure(BaseModel):
    """3-Act Structure with predefined acts"""
    acts: List[Arc] = Field(...)

class FourteenSpreadStructure(BaseModel):
    """14-Spread Structure with predefined spreads"""
    spreads: List[Spread] = Field(...)

class StoryArcSchema(BaseModel):
    """Combined 3-Act and 14-Spread Structure"""
    model_config = ConfigDict(
        json_schema_extra={
            "additionalProperties": False
        }
    )
    acts: List[Arc] = Field(..., description="3-act structure")
    spreads: List[Spread] = Field(..., description="14-spread structure")

# JSON Schema Example:
"""
{
    "three_act_structure": {
        "acts": [
            {
                "act_number": 1,
                "act_name": "Setup",
                "description": "Character/Background Introduction + Peaceful Daily Life"
            },
            {
                "act_number": 2,
                "act_name": "Confrontation",
                "description": "Development and Crisis Escalation"
            },
            {
                "act_number": 3,
                "act_name": "Resolution",
                "description": "Climax and Resolution"
            }
        ]
    },
    "fourteen_spread_structure": {
        "spreads": [
            {
                "spread_number": 1,
                "description": "Character/Background Introduction + Peaceful Daily Life - Introduction of protagonist and his happy daily space to help readers feel comfortable and immersed. First spread of the story that captures reader's attention with warm and attractive illustrations.",
                "act_number": 1
            },
            {
                "spread_number": 2,
                "description": "Small Problem/Desire Discovery in Peace - A desire or problem that creates a small crack in the protagonist's daily life is first revealed. Page 4 reveals the discovery and transitions to next spread showing character's reaction to induce empathy.",
                "act_number": 1
            },
            {
                "spread_number": 3,
                "description": "Character introduction and peaceful daily life continuation - Establishing the protagonist's world and routine before introducing the main conflict.",
                "act_number": 1
            },
            {
                "spread_number": 4,
                "description": "Inciting Incident + Goal Setting - Clear goal setting to solve the problem. The trigger for the protagonist to start acting and preparation for adventure.",
                "act_number": 2
            },
            {
                "spread_number": 5,
                "description": "First Attempt (Failure 1) - The protagonist makes a first attempt to solve the problem but encounters unexpected difficulties and fails.",
                "act_number": 2
            },
            {
                "spread_number": 6,
                "description": "Frustration and New Information/Conflict Deepening - Frustration from the first failure. However, not giving up completely, recognizing new clues for the next attempt.",
                "act_number": 2
            },
            {
                "spread_number": 7,
                "description": "Second Attempt (Failure 2) - A bolder or different strategy than the first attempt, but still fails. The situation becomes more complex or tension rises.",
                "act_number": 2
            },
            {
                "spread_number": 8,
                "description": "Crisis Escalation / Before Emotional Low Point - Deep frustration from consecutive failures. The moment when 'What should I do now?' thoughts arise.",
                "act_number": 2
            },
            {
                "spread_number": 9,
                "description": "Third Attempt Preparation/New Idea - Gaining new ideas from frustration or preparing for the final attempt based on what was learned from past failures.",
                "act_number": 2
            },
            {
                "spread_number": 10,
                "description": "Third Attempt (Most Daring Attempt) - The most important and daring attempt using all experiences and courage accumulated so far.",
                "act_number": 2
            },
            {
                "spread_number": 11,
                "description": "Pre-Climax Tension - Waiting, moments of near success, or the appearance of final obstacles as tension reaches its peak.",
                "act_number": 3
            },
            {
                "spread_number": 12,
                "description": "Climax - Problem Solving Moment - The moment when the protagonist's efforts bear fruit. The most dramatic and moving scene.",
                "act_number": 3
            },
            {
                "spread_number": 13,
                "description": "Resolution - Reward and Realization - The scene where the problem is solved and the protagonist receives rewards or gains new insights.",
                "act_number": 3
            },
            {
                "spread_number": 14,
                "description": "New Daily Life / Showing Growth - Showing the protagonist's changed appearance or new daily life after the problem is solved, suggesting growth.",
                "act_number": 3
            }
        ]
    }
}
"""
