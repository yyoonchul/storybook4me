# ============================================================================
# OpenAI Image Generation Client Implementation
# ============================================================================

import base64
import requests
from io import BytesIO
from pathlib import Path
from dotenv import load_dotenv
import os

from PIL import Image


def openai_generate_image(model: str, prompt: str, aspect_ratio: str = None) -> bytes:
    """
    Generate image using OpenAI API.
    
    Args:
        model: OpenAI model name
        prompt: Text description of the desired image
        aspect_ratio: Aspect ratio (e.g., "3:2", "16:9", "1:1")
        
    Returns:
        Image bytes
        
    Raises:
        ValueError: If generation fails
    """
    # Load .env locally
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    from openai import OpenAI
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    try:
        # Determine size based on aspect ratio (default to 3:2 landscape)
        final_aspect_ratio = aspect_ratio if aspect_ratio else "3:2"
        
        if final_aspect_ratio == "3:2":
            size = "1536x1024"  # 3:2 landscape
        elif final_aspect_ratio == "16:9":
            size = "1792x1024" if model == "dall-e-3" else "1024x1024"
        elif final_aspect_ratio == "1:1":
            size = "1024x1024"
        else:
            size = "1536x1024"  # Default to 3:2
        
        # For gpt-image-1, use the images.generate endpoint
        if model == "gpt-image-1":
            response = client.images.generate(
                model=model,
                prompt=prompt,
                n=1,
                size=size
                # gpt-image-1 always returns base64, no response_format parameter needed
            )
        else:
            # For DALL-E models
            response = client.images.generate(
                model=model,
                prompt=prompt,
                n=1,
                size=size,
                response_format="b64_json"
            )
        
        # Extract base64 image data
        image_data_b64 = response.data[0].b64_json
        image_data = base64.b64decode(image_data_b64)
        
        return image_data
        
    except Exception as e:
        raise ValueError(f"OpenAI image generation failed: {str(e)}")


def openai_generate_image_from_reference(model: str, prompt: str, reference_url: str) -> bytes:
    """
    Generate image using OpenAI API with reference image.
    
    Args:
        model: OpenAI model name
        prompt: Text description of the desired changes/addition
        reference_url: URL of the reference image
        
    Returns:
        Image bytes
        
    Raises:
        ValueError: If generation fails
    """
    # Load .env locally
    root = Path(__file__).resolve().parents[3]
    env_path = root / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=False)

    from openai import OpenAI
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    try:
        # Download reference image
        response = requests.get(reference_url)
        response.raise_for_status()
        reference_image_data = response.content
        
        # For gpt-image-1, use the images.edits endpoint with multiple images
        if model == "gpt-image-1":
            # Convert to PIL Image to ensure proper format
            reference_image = Image.open(BytesIO(reference_image_data))
            
            # Convert back to bytes for the API
            img_buffer = BytesIO()
            reference_image.save(img_buffer, format='PNG')
            reference_image_bytes = img_buffer.getvalue()
            
            # Use images.edits endpoint for gpt-image-1
            response = client.images.edits(
                model=model,
                image=reference_image_bytes,
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="b64_json"
            )
            
        else:
            # For DALL-E models, we can't use reference images directly
            # Fall back to text-to-image generation
            response = client.images.generate(
                model=model,
                prompt=f"Based on this description: {prompt}. Create an image with similar style and composition.",
                n=1,
                size="1024x1024",
                response_format="b64_json"
            )
        
        # Extract base64 image data
        image_data_b64 = response.data[0].b64_json
        image_data = base64.b64decode(image_data_b64)
        
        return image_data
        
    except Exception as e:
        raise ValueError(f"OpenAI reference-based image generation failed: {str(e)}")
