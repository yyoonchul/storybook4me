# ============================================================================
# OpenAI Client Implementation
# ============================================================================

import json
from typing import Any
from pydantic import BaseModel
from pathlib import Path
import os
from dotenv import load_dotenv


def openai_generate_text(model: str, input_text: str) -> tuple[str, int | None, int | None]:
    """
    Generate text using OpenAI Responses API.
    
    Args:
        model: OpenAI model name
        input_text: Input prompt text
        
    Returns:
        Tuple of (output_text, input_tokens, output_tokens)
    """
    # Load .env locally (no .env.example fallback)
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    from openai import OpenAI

    client = OpenAI()

    response = client.responses.create(
        model=model,
        input=input_text,
    )
    
    # Extract text from response
    text = ""
    if response.output and len(response.output) > 0:
        # Find the message type item (skip reasoning items)
        for output_item in response.output:
            if hasattr(output_item, 'type') and output_item.type == 'message':
                if hasattr(output_item, 'content') and output_item.content and len(output_item.content) > 0:
                    for content_item in output_item.content:
                        if hasattr(content_item, 'type') and content_item.type == 'output_text':
                            if hasattr(content_item, 'text'):
                                text = content_item.text
                                break
                break
    
    # Extract token usage
    input_tokens = None
    output_tokens = None
    if hasattr(response, 'usage') and response.usage:
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
    
    return text, input_tokens, output_tokens


def openai_generate_structured(
    model: str,
    input_text: str,
    schema: type[BaseModel],
) -> tuple[dict[str, Any], int | None, int | None]:
    """
    Generate structured output using OpenAI Responses API with Pydantic schema.
    
    Args:
        model: OpenAI model name
        input_text: Input prompt text
        schema: Pydantic model class for validation
        
    Returns:
        Tuple of (parsed_dict, input_tokens, output_tokens)
    """
    # Load .env locally (no .env.example fallback)
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Get schema as JSON Schema for structured output
    json_schema = schema.model_json_schema()
    
    # Ensure additionalProperties is false for OpenAI API
    if "additionalProperties" not in json_schema:
        json_schema["additionalProperties"] = False
    
    # Ensure all properties have additionalProperties: false
    if "properties" in json_schema:
        for prop_name, prop_schema in json_schema["properties"].items():
            if isinstance(prop_schema, dict) and "additionalProperties" not in prop_schema:
                prop_schema["additionalProperties"] = False
    
    response = client.responses.create(
        model=model,
        input=input_text,
        text={
            "format": {
                "type": "json_schema",
                "name": "structured_output",
                "schema": json_schema
            }
        }
    )
    
    # Extract parsed object from response
    parsed_dict = {}
    if response.output and len(response.output) > 0:
        # Find the message type item (skip reasoning items)
        for output_item in response.output:
            if hasattr(output_item, 'type') and output_item.type == 'message':
                if hasattr(output_item, 'content') and output_item.content and len(output_item.content) > 0:
                    for content_item in output_item.content:
                        if hasattr(content_item, 'type') and content_item.type == 'output_text':
                            if hasattr(content_item, 'text'):
                                try:
                                    parsed_dict = json.loads(content_item.text)
                                except json.JSONDecodeError:
                                    parsed_dict = {}
                                break
                break
    
    # Extract token usage
    input_tokens = None
    output_tokens = None
    if hasattr(response, 'usage') and response.usage:
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
    
    return parsed_dict, input_tokens, output_tokens