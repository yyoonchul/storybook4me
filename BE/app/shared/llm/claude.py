# ============================================================================
# Claude Client Implementation
# ============================================================================

import json
from typing import Any
from pydantic import BaseModel
from pathlib import Path
from dotenv import load_dotenv
import os


def claude_generate_text(model: str, input_text: str) -> tuple[str, int | None, int | None]:
    """
    Generate text using Claude Messages API.
    
    Args:
        model: Claude model name
        input_text: Input prompt text
        
    Returns:
        Tuple of (output_text, input_tokens, output_tokens)
    """
    # Load .env locally
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    import anthropic
    
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEYS"))
    
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        messages=[
            {"role": "user", "content": input_text}
        ]
    )
    
    # Extract text from response
    text = message.content[0].text if message.content else ""
    
    # Extract token usage
    input_tokens = message.usage.input_tokens if message.usage else None
    output_tokens = message.usage.output_tokens if message.usage else None
    
    return text, input_tokens, output_tokens


def claude_generate_structured(
    model: str,
    input_text: str,
    schema: type[BaseModel],
) -> tuple[dict[str, Any], int | None, int | None]:
    """
    Generate structured output using Claude Messages API.
    
    Args:
        model: Claude model name
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

    import anthropic
    
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEYS"))
    
    # Get schema as JSON Schema
    json_schema = schema.model_json_schema()
    
    # Create prompt that instructs model to output JSON matching the schema
    structured_prompt = f"""Please respond with valid JSON that matches this schema:

{json.dumps(json_schema, indent=2)}

User request: {input_text}

Respond with ONLY the JSON object, no other text."""
    
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        messages=[
            {"role": "user", "content": structured_prompt}
        ]
    )
    
    # Extract and parse JSON from response
    text = message.content[0].text if message.content else "{}"
    parsed_dict = json.loads(text)
    
    # Extract token usage
    input_tokens = message.usage.input_tokens if message.usage else None
    output_tokens = message.usage.output_tokens if message.usage else None
    
    return parsed_dict, input_tokens, output_tokens