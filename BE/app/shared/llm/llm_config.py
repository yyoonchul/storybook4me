"""
LLM Provider Model Configuration

Centralized registry of available models for each provider.
Maps friendly alias names to actual model IDs.
Update these mappings as new models become available.
"""

# OpenAI Models: alias -> model ID
OPENAI_MODELS = {
    "gpt-5": "gpt-5",
    "gpt-5-mini": "gpt-5-mini",
    "gpt-5-nano": "gpt-5-nano",
}

# Google Models: alias -> model ID
GOOGLE_MODELS = {
    "gemini-2.5-flash": "gemini-2.5-flash",
    "gemini-2.5-pro": "gemini-2.5-pro",
}

# Claude Models: alias -> model ID
CLAUDE_MODELS = {
    "claude-sonnet-4-5": "claude-sonnet-4-5-20250929",
    "claude-sonnet-4": "claude-sonnet-4-20250514",
    "claude-haiku-4-5": "claude-haiku-4-5-20251001",
}


def get_openai_model_id(alias: str) -> str:
    """
    Get OpenAI model ID from alias.
    
    Args:
        alias: Model alias (e.g., "gpt-4o")
        
    Returns:
        Actual model ID
        
    Raises:
        ValueError: If alias not found
    """
    if alias not in OPENAI_MODELS:
        raise ValueError(f"Unknown OpenAI model alias: {alias}. Available: {list(OPENAI_MODELS.keys())}")
    return OPENAI_MODELS[alias]


def get_google_model_id(alias: str) -> str:
    """
    Get Google model ID from alias.
    
    Args:
        alias: Model alias (e.g., "gemini-flash")
        
    Returns:
        Actual model ID
        
    Raises:
        ValueError: If alias not found
    """
    if alias not in GOOGLE_MODELS:
        raise ValueError(f"Unknown Google model alias: {alias}. Available: {list(GOOGLE_MODELS.keys())}")
    return GOOGLE_MODELS[alias]


def get_claude_model_id(alias: str) -> str:
    """
    Get Claude model ID from alias.
    
    Args:
        alias: Model alias (e.g., "claude-sonnet")
        
    Returns:
        Actual model ID
        
    Raises:
        ValueError: If alias not found
    """
    if alias not in CLAUDE_MODELS:
        raise ValueError(f"Unknown Claude model alias: {alias}. Available: {list(CLAUDE_MODELS.keys())}")
    return CLAUDE_MODELS[alias]


def get_openai_models() -> list[str]:
    """Get all available OpenAI model aliases."""
    return list(OPENAI_MODELS.keys())


def get_google_models() -> list[str]:
    """Get all available Google model aliases."""
    return list(GOOGLE_MODELS.keys())


def get_claude_models() -> list[str]:
    """Get all available Claude model aliases."""
    return list(CLAUDE_MODELS.keys())


# Default model for rewrite operations
DEFAULT_REWRITE_PROVIDER = "openai"
DEFAULT_REWRITE_MODEL = "gpt-5-mini"

# Default model for bible generation
DEFAULT_BIBLE_PROVIDER = "openai"
DEFAULT_BIBLE_MODEL = "gpt-5-mini"

# Default model for arc generation
DEFAULT_ARC_PROVIDER = "openai"
DEFAULT_ARC_MODEL = "gpt-5-mini"

# Default model for draft generation
DEFAULT_DRAFT_PROVIDER = "openai"
DEFAULT_DRAFT_MODEL = "gpt-5-mini"

