"""
Base Image Service - Provider-agnostic interface

Unified API for image generation across OpenAI and Google with Supabase storage integration.
"""

import uuid
import base64
from dataclasses import dataclass
from enum import Enum
from typing import Optional

from app.shared.database.supabase_client import supabase


class Provider(str, Enum):
    """Supported image generation providers."""
    OPENAI = "openai"
    GOOGLE = "google"


@dataclass
class ImageResult:
    """Result from image generation."""
    url: str  # Supabase public URL
    storage_path: str
    file_size: int
    mime_type: str


# Supabase Storage configuration
BUCKET_NAME = "storybook_assets"  # Bucket for storybook-generated assets
STORAGE_PATH_PREFIX = "generated"


def _upload_to_supabase(image_data: bytes, file_extension: str = "png", custom_path: str = None) -> tuple[str, str]:
    """
    Upload generated image to Supabase storage.
    
    Args:
        image_data: Raw image bytes
        file_extension: File extension (default: "png")
        custom_path: Custom storage path (optional, defaults to "generated")
        
    Returns:
        Tuple of (public_url, storage_path)
        
    Raises:
        ValueError: If upload fails
    """
    try:
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Use custom path if provided, otherwise use default
        if custom_path:
            storage_path = f"{custom_path}/{file_id}.{file_extension}"
        else:
            storage_path = f"{STORAGE_PATH_PREFIX}/{file_id}.{file_extension}"
        
        # Upload to Supabase Storage
        upload_result = supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=image_data,
            file_options={
                "content-type": f"image/{file_extension}",
                "upsert": "false"
            }
        )
        
        if not upload_result:
            raise ValueError("Failed to upload image to Supabase storage")
        
        # Get public URL
        public_url_result = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
        
        if not public_url_result:
            raise ValueError("Failed to get public URL for uploaded image")
        
        return public_url_result, storage_path
        
    except Exception as e:
        raise ValueError(f"Supabase upload failed: {str(e)}")


def _download_from_supabase_url(url: str) -> bytes:
    """
    Download image from Supabase URL.
    
    Args:
        url: Supabase public URL
        
    Returns:
        Image bytes
        
    Raises:
        ValueError: If download fails
    """
    try:
        import requests
        
        response = requests.get(url)
        response.raise_for_status()
        
        return response.content
        
    except Exception as e:
        raise ValueError(f"Failed to download image from URL: {str(e)}")


def generate_image(provider: Provider, model: str, prompt: str, custom_path: str = None, aspect_ratio: str = None) -> ImageResult:
    """
    Generate an image from text prompt.
    
    Args:
        provider: Image generation provider to use
        model: Model alias (e.g., "gemini-flash-image", "gpt-image-1")
        prompt: Text description of the desired image
        custom_path: Custom storage path (optional, defaults to "generated")
        aspect_ratio: Aspect ratio for image (optional, e.g., "3:2", "16:9", "1:1")
        
    Returns:
        ImageResult with Supabase URL and metadata
        
    Raises:
        ValueError: If generation fails or model alias is invalid
    """
    try:
        # Resolve model alias to actual model ID
        if provider == Provider.OPENAI:
            from .image_config import get_openai_model_id
            from .openai import openai_generate_image
            model_id = get_openai_model_id(model)
            image_data = openai_generate_image(model_id, prompt, aspect_ratio)
        elif provider == Provider.GOOGLE:
            from .image_config import get_google_model_id
            from .google import google_generate_image
            model_id = get_google_model_id(model)
            image_data = google_generate_image(model_id, prompt, aspect_ratio)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        # Upload to Supabase and get URL
        public_url, storage_path = _upload_to_supabase(image_data, "png", custom_path)
        
        return ImageResult(
            url=public_url,
            storage_path=storage_path,
            file_size=len(image_data),
            mime_type="image/png"
        )
    
    except ImportError as e:
        raise ValueError(f"Provider {provider} SDK not installed: {e}")
    except Exception as e:
        raise ValueError(f"Image generation failed for {provider}: {e}")


def generate_image_from_reference(
    provider: Provider,
    model: str,
    prompt: str,
    reference_url: str,
    custom_path: str = None
) -> ImageResult:
    """
    Generate an image using a reference image and text prompt.
    
    Args:
        provider: Image generation provider to use
        model: Model alias (e.g., "gemini-flash-image", "gpt-image-1")
        prompt: Text description of the desired changes/addition
        reference_url: Supabase URL of the reference image
        custom_path: Custom storage path (optional, defaults to "generated")
        
    Returns:
        ImageResult with Supabase URL and metadata
        
    Raises:
        ValueError: If generation fails or model alias is invalid
    """
    try:
        # Resolve model alias to actual model ID
        if provider == Provider.OPENAI:
            from .image_config import get_openai_model_id
            from .openai import openai_generate_image_from_reference
            model_id = get_openai_model_id(model)
            image_data = openai_generate_image_from_reference(model_id, prompt, reference_url)
        elif provider == Provider.GOOGLE:
            from .image_config import get_google_model_id
            from .google import google_generate_image_from_reference
            model_id = get_google_model_id(model)
            image_data = google_generate_image_from_reference(model_id, prompt, reference_url)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        # Upload to Supabase and get URL
        public_url, storage_path = _upload_to_supabase(image_data, "png", custom_path)
        
        return ImageResult(
            url=public_url,
            storage_path=storage_path,
            file_size=len(image_data),
            mime_type="image/png"
        )
    
    except ImportError as e:
        raise ValueError(f"Provider {provider} SDK not installed: {e}")
    except Exception as e:
        raise ValueError(f"Reference-based image generation failed for {provider}: {e}")
