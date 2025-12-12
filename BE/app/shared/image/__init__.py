"""
Image Generation Utility

Unified interface for image generation across multiple providers with Supabase storage integration.

Usage:
    from app.shared.image.base import generate_image, generate_image_from_reference, Provider
    
    # Generate image from text
    result = generate_image(
        provider=Provider.GOOGLE,
        model="gemini-flash-image",
        prompt="A cute baby sea otter"
    )
    print(f"Image URL: {result.url}")
    
    # Generate image with reference
    result = generate_image_from_reference(
        provider=Provider.OPENAI,
        model="gpt-image-1",
        prompt="Add a wizard hat to the character",
        reference_url="https://supabase-url/character.png",
        custom_path="storybook_pages"  # Optional custom path
    )
    print(f"Generated image URL: {result.url}")
"""

from .base import generate_image, generate_image_from_reference, Provider, ImageResult
from .image_config import (
    get_google_model_id,
    get_openai_model_id,
    get_google_models,
    get_openai_models,
    DEFAULT_IMAGE_PROVIDER,
    DEFAULT_IMAGE_MODEL
)

__all__ = [
    "generate_image",
    "generate_image_from_reference", 
    "Provider",
    "ImageResult",
    "get_google_model_id",
    "get_openai_model_id",
    "get_google_models",
    "get_openai_models",
    "DEFAULT_IMAGE_PROVIDER",
    "DEFAULT_IMAGE_MODEL"
]
