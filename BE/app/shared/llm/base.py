"""
Base LLM Service - Provider-agnostic interface

Unified API for text generation and structured outputs across OpenAI, Google, and Claude.
"""

import json
import math
from dataclasses import dataclass
from enum import Enum
from typing import Any

from pydantic import BaseModel

from .usage_tracker import record_llm_usage


class Provider(str, Enum):
    """Supported LLM providers."""
    OPENAI = "openai"
    GOOGLE = "google"
    CLAUDE = "claude"


@dataclass
class LLMResult:
    """Result from LLM generation."""
    text: str | None
    parsed: Any | None
    input_tokens: int
    output_tokens: int


def estimate_tokens(text: str) -> int:
    """
    Rough token estimation: ~4 characters per token.
    Returns at least 1 token for non-empty strings.
    """
    if not text:
        return 0
    return max(1, math.ceil(len(text) / 4))


def generate_text(
    provider: Provider,
    model: str,
    input_text: str,
    *,
    user_id: str | None = None,
    usage_metadata: dict[str, Any] | None = None,
) -> LLMResult:
    """
    Generate text from the specified provider.
    
    Args:
        provider: LLM provider to use
        model: Model alias (e.g., "gpt-4o", "gemini-flash", "claude-sonnet")
        input_text: Input prompt text
        
    Returns:
        LLMResult with generated text and token usage
        
    Raises:
        ValueError: If generation fails or model alias is invalid
    """
    try:
        # Resolve model alias to actual model ID
        if provider == Provider.OPENAI:
            from .llm_config import get_openai_model_id
            from .openai import openai_generate_text
            model_id = get_openai_model_id(model)
            text, input_tok, output_tok = openai_generate_text(model_id, input_text)
        elif provider == Provider.GOOGLE:
            from .llm_config import get_google_model_id
            from .google import google_generate_text
            model_id = get_google_model_id(model)
            text, input_tok, output_tok = google_generate_text(model_id, input_text)
        elif provider == Provider.CLAUDE:
            from .llm_config import get_claude_model_id
            from .claude import claude_generate_text
            model_id = get_claude_model_id(model)
            text, input_tok, output_tok = claude_generate_text(model_id, input_text)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        # Fallback to estimation if tokens not provided
        if input_tok is None:
            input_tok = estimate_tokens(input_text)
        if output_tok is None:
            output_tok = estimate_tokens(text)
        
        result = LLMResult(
            text=text,
            parsed=None,
            input_tokens=input_tok,
            output_tokens=output_tok,
        )
        record_llm_usage(
            user_id=user_id,
            provider=str(provider),
            model=model,
            input_tokens=input_tok,
            output_tokens=output_tok,
            metadata=usage_metadata,
        )
        return result
    
    except ImportError as e:
        raise ValueError(f"Provider {provider} SDK not installed: {e}")
    except Exception as e:
        raise ValueError(f"Text generation failed for {provider}: {e}")


def generate_structured(
    provider: Provider,
    model: str,
    input_text: str,
    schema: type[BaseModel],
    *,
    user_id: str | None = None,
    usage_metadata: dict[str, Any] | None = None,
) -> LLMResult:
    """
    Generate structured output validated against a Pydantic schema.
    
    Args:
        provider: LLM provider to use
        model: Model alias (e.g., "gpt-4o", "gemini-flash", "claude-sonnet")
        input_text: Input prompt text
        schema: Pydantic model class for validation
        
    Returns:
        LLMResult with parsed object and JSON text
        
    Raises:
        ValueError: If generation, validation fails, or model alias is invalid
    """
    try:
        # Resolve model alias to actual model ID
        if provider == Provider.OPENAI:
            from .llm_config import get_openai_model_id
            from .openai import openai_generate_structured
            model_id = get_openai_model_id(model)
            parsed_dict, input_tok, output_tok = openai_generate_structured(
                model_id, input_text, schema
            )
        elif provider == Provider.GOOGLE:
            from .llm_config import get_google_model_id
            from .google import google_generate_structured
            model_id = get_google_model_id(model)
            parsed_dict, input_tok, output_tok = google_generate_structured(
                model_id, input_text, schema
            )
        elif provider == Provider.CLAUDE:
            from .llm_config import get_claude_model_id
            from .claude import claude_generate_structured
            model_id = get_claude_model_id(model)
            parsed_dict, input_tok, output_tok = claude_generate_structured(
                model_id, input_text, schema
            )
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        # Convert to pretty JSON string
        text = json.dumps(parsed_dict, indent=2, ensure_ascii=False)
        
        # Validate and parse with Pydantic
        parsed = schema(**parsed_dict)
        
        # Fallback to estimation if tokens not provided
        if input_tok is None:
            input_tok = estimate_tokens(input_text)
        if output_tok is None:
            output_tok = estimate_tokens(text)
        
        result = LLMResult(
            text=text,
            parsed=parsed,
            input_tokens=input_tok,
            output_tokens=output_tok,
        )
        record_llm_usage(
            user_id=user_id,
            provider=str(provider),
            model=model,
            input_tokens=input_tok,
            output_tokens=output_tok,
            metadata=usage_metadata,
        )
        return result
    
    except ImportError as e:
        raise ValueError(f"Provider {provider} SDK not installed: {e}")
    except Exception as e:
        raise ValueError(f"Structured generation failed for {provider}: {e}")

