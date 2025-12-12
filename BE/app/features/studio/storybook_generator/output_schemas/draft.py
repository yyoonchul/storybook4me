from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class SpreadScript(BaseModel):
    """Spread Script - 2 pages per spread"""
    model_config = ConfigDict(
        json_schema_extra={
            "additionalProperties": False
        }
    )
    
    spread_number: int = Field(..., description="Spread number (1-14)")
    script_1: str = Field(..., description="Script for page 1, considering the last sentence of the previous page")
    script_2: str = Field(..., description="Script for page 2, considering page turn strategy")

class FinalScriptSchema(BaseModel):
    """Final Script Schema - 14 spreads with complete story"""
    model_config = ConfigDict(
        json_schema_extra={
            "additionalProperties": False
        }
    )
    
    storybook_id: str = Field(..., description="Storybook ID")
    user_id: str = Field(..., description="User ID")
    
    # 14 Spread Scripts
    spreads: List[SpreadScript] = Field(..., description="14 spread scripts", min_length=14, max_length=14)

# JSON Schema Example:
"""
{
    "storybook_id": "uuid-here",
    "user_id": "clerk-user-id",
    "spreads": [
        {
            "spread_number": 1,
            "script_1": "Once upon a time, in a cozy forest house, lived a little bear named Pobi.",
            "script_2": "His house was filled with the sweetest honey, and he was the happiest bear in the whole forest."
        },
        {
            "spread_number": 2,
            "script_1": "Every morning, Pobi would wake up and enjoy a big spoonful of honey.",
            "script_2": "But one day, when he reached for his honey pot, it was completely empty!"
        },
        {
            "spread_number": 3,
            "script_1": "Pobi felt very sad. He loved honey more than anything in the world.",
            "script_2": "That's when he decided to go on an adventure to find more honey."
        },
        {
            "spread_number": 4,
            "script_1": "Pobi walked through the forest until he saw a tall tree with a bee hive.",
            "script_2": "He tried to climb up, but slipped and fell down with a big thump!"
        },
        {
            "spread_number": 5,
            "script_1": "Pobi was disappointed, but then he saw a little squirrel running by.",
            "script_2": "The squirrel told him about a magical flower garden where bees love to visit."
        },
        {
            "spread_number": 6,
            "script_1": "Excited, Pobi ran to the flower garden and started picking flowers.",
            "script_2": "But suddenly, a swarm of angry bees appeared, buzzing loudly!"
        },
        {
            "spread_number": 7,
            "script_1": "Pobi ran away as fast as he could, feeling very discouraged.",
            "script_2": "He sat down under a tree and wondered if he would ever find honey again."
        },
        {
            "spread_number": 8,
            "script_1": "Just then, Pobi noticed something sparkling in the grass nearby.",
            "script_2": "It was a tiny flower petal that gave him a wonderful idea!"
        },
        {
            "spread_number": 9,
            "script_1": "Pobi collected many flower petals and arranged them into a beautiful garden.",
            "script_2": "He sat quietly and waited, hoping that his plan would work."
        },
        {
            "spread_number": 10,
            "script_1": "Time passed slowly, and Pobi began to worry that no bees would come.",
            "script_2": "But then, from far away, he heard a gentle buzzing sound..."
        },
        {
            "spread_number": 11,
            "script_1": "A whole family of bees flew to Pobi's flower garden!",
            "script_2": "They were so happy with the beautiful flowers that they made lots of honey."
        },
        {
            "spread_number": 12,
            "script_1": "Pobi was overjoyed! He had more honey than he could ever eat.",
            "script_2": "But then he realized something important - honey tastes even sweeter when shared with friends."
        },
        {
            "spread_number": 13,
            "script_1": "From that day on, Pobi's house was always filled with laughter and honey.",
            "script_2": "All his forest friends would visit to enjoy the sweet treats together."
        },
        {
            "spread_number": 14,
            "script_1": "And Pobi learned that the best adventures lead to the greatest friendships.",
            "script_2": "The end. (But really, it was just the beginning of many more sweet adventures!)"
        }
    ]
}
"""