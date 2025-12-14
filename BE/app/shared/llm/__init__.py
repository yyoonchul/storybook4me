"""
LLM Utilities - Provider-agnostic interface for text generation and structured outputs.

Usage:
    from app.shared.llm import Provider, generate_text, generate_structured
    
    # Text generation with model alias
    result = generate_text(
        provider=Provider.OPENAI,
        model="gpt-4o",  # Alias, automatically resolved to "gpt-4o-2024-08-06"
        input_text="Explain quantum computing in simple terms"
    )
    print(result.text)
    print(f"Tokens: {result.input_tokens} in, {result.output_tokens} out")
    
    # Structured output with model alias
    from pydantic import BaseModel
    
    class Recipe(BaseModel):
        name: str
        ingredients: list[str]
    
    result = generate_structured(
        provider=Provider.GOOGLE,
        model="gemini-flash",  # Alias, automatically resolved to "gemini-2.5-flash"
        input_text="Give me a chocolate chip cookie recipe",
        schema=Recipe
    )
    print(result.text)  # Pretty-printed JSON
    print(result.parsed)  # Pydantic instance
    
    # Get available model aliases
    from app.shared.llm import get_openai_models, OPENAI_MODELS
    
    print(get_openai_models())  # ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1']
    print(OPENAI_MODELS["gpt-4o"])  # 'gpt-4o-2024-08-06'
"""

from .base import Provider, LLMResult, generate_text, generate_structured
from .llm_config import (
    get_openai_models,
    get_google_models,
    get_claude_models,
    get_openai_model_id,
    get_google_model_id,
    get_claude_model_id,
    OPENAI_MODELS,
    GOOGLE_MODELS,
    CLAUDE_MODELS,
)

__all__ = [
    "Provider",
    "LLMResult",
    "generate_text",
    "generate_structured",
    "get_openai_models",
    "get_google_models",
    "get_claude_models",
    "get_openai_model_id",
    "get_google_model_id",
    "get_claude_model_id",
    "OPENAI_MODELS",
    "GOOGLE_MODELS",
    "CLAUDE_MODELS",
]

