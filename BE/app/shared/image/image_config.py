"""
Image Provider Model Configuration

Centralized registry of available models for each image generation provider.
Maps friendly alias names to actual model IDs.
Update these mappings as new models become available.
"""

# Google Image Models: alias -> model ID
GOOGLE_IMAGE_MODELS = {
    "gemini-flash-image": "gemini-2.5-flash-image",
    "gemini-pro-image": "gemini-2.5-pro-image"
}

# OpenAI Image Models: alias -> model ID
OPENAI_IMAGE_MODELS = {
    "gpt-image-1": "gpt-image-1",
    "dall-e-3": "dall-e-3",
    "dall-e-2": "dall-e-2"
}


def get_google_model_id(alias: str) -> str:
    """
    Get Google model ID from alias.
    
    Args:
        alias: Model alias (e.g., "gemini-flash-image")
        
    Returns:
        Actual model ID
        
    Raises:
        ValueError: If alias not found
    """
    if alias not in GOOGLE_IMAGE_MODELS:
        raise ValueError(f"Unknown Google image model alias: {alias}. Available: {list(GOOGLE_IMAGE_MODELS.keys())}")
    return GOOGLE_IMAGE_MODELS[alias]


def get_openai_model_id(alias: str) -> str:
    """
    Get OpenAI model ID from alias.
    
    Args:
        alias: Model alias (e.g., "gpt-image-1")
        
    Returns:
        Actual model ID
        
    Raises:
        ValueError: If alias not found
    """
    if alias not in OPENAI_IMAGE_MODELS:
        raise ValueError(f"Unknown OpenAI image model alias: {alias}. Available: {list(OPENAI_IMAGE_MODELS.keys())}")
    return OPENAI_IMAGE_MODELS[alias]


def get_google_models() -> list[str]:
    """Get all available Google image model aliases."""
    return list(GOOGLE_IMAGE_MODELS.keys())


def get_openai_models() -> list[str]:
    """Get all available OpenAI image model aliases."""
    return list(OPENAI_IMAGE_MODELS.keys())


# Default model for image generation
DEFAULT_IMAGE_PROVIDER = "google"
DEFAULT_IMAGE_MODEL = "gemini-flash-image"
