# ============================================================================
# Google Gemini Client Implementation
# ============================================================================

import json
from typing import Any
from pydantic import BaseModel
from pathlib import Path
from dotenv import load_dotenv
import os


def google_generate_text(model: str, input_text: str) -> tuple[str, int | None, int | None]:
    """
    Generate text using Google Gemini API.
    
    Args:
        model: Gemini model name
        input_text: Input prompt text
        
    Returns:
        Tuple of (output_text, input_tokens, output_tokens)
    """
    # Load .env locally
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    from google import genai
    
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    
    response = client.models.generate_content(
        model=model,
        contents=input_text,
    )
    
    # Extract text
    text = response.text
    
    # Google SDK may not expose usage metadata directly
    # Return None to trigger estimation fallback
    input_tokens = None
    output_tokens = None
    
    return text, input_tokens, output_tokens


def google_generate_structured(
    model: str,
    input_text: str,
    schema: type[BaseModel],
) -> tuple[dict[str, Any], int | None, int | None]:
    """
    Generate structured output using Google Gemini API with Pydantic schema.
    
    Args:
        model: Gemini model name
        input_text: Input prompt text
        schema: Pydantic model class for validation
        
    Returns:
        Tuple of (parsed_dict, input_tokens, output_tokens)
    """
    # Load .env locally
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    from google import genai
    
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    
    response = client.models.generate_content(
        model=model,
        contents=input_text,
        config={
            "response_mime_type": "application/json",
            "response_schema": schema,
        },
    )
    
    # Parse the JSON response
    parsed_dict = json.loads(response.text)
    
    # Google SDK may not expose usage metadata directly
    # Return None to trigger estimation fallback
    input_tokens = None
    output_tokens = None
    
    return parsed_dict, input_tokens, output_tokens
