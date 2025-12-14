# ============================================================================
# Google Gemini Image Generation Client Implementation
# ============================================================================

import base64
import requests
from io import BytesIO
from pathlib import Path
from dotenv import load_dotenv
import os

from PIL import Image


def google_generate_image(model: str, prompt: str, aspect_ratio: str = None) -> bytes:
    """
    Generate image using Google Gemini API.
    
    Args:
        model: Gemini model name
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

    from google import genai
    from google.genai import types
    
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    
    try:
        # Build config with aspect ratio (default to 3:2)
        from google.genai import types
        final_aspect_ratio = aspect_ratio if aspect_ratio else "3:2"
        config = types.GenerateContentConfig(
            image_config=types.ImageConfig(
                aspect_ratio=final_aspect_ratio,
            )
        )
        
        response = client.models.generate_content(
            model=model,
            contents=[prompt],
            config=config
        )
        
        # Extract image from response
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                # Check if data is already decoded or needs decoding
                if isinstance(part.inline_data.data, bytes):
                    # Already binary data
                    image_data = part.inline_data.data
                else:
                    # Base64 string, needs decoding
                    image_data = base64.b64decode(part.inline_data.data)
                
                return image_data
        
        raise ValueError("No image data found in response")
        
    except Exception as e:
        raise ValueError(f"Google image generation failed: {str(e)}")


def google_generate_image_from_reference(model: str, prompt: str, reference_url: str) -> bytes:
    """
    Generate image using Google Gemini API with reference image.
    
    Args:
        model: Gemini model name
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

    from google import genai
    from google.genai import types
    
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    
    try:
        # Download reference image
        response = requests.get(reference_url)
        response.raise_for_status()
        reference_image_data = response.content
        
        # Convert to PIL Image and then back to bytes for Gemini API
        reference_image = Image.open(BytesIO(reference_image_data))
        
        # Generate content with both prompt and reference image
        response = client.models.generate_content(
            model=model,
            contents=[prompt, reference_image],
            config=types.GenerateContentConfig(
                response_modalities=['Image']
            )
        )
        
        # Extract image from response
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                # Decode base64 image data
                image_data = base64.b64decode(part.inline_data.data)
                return image_data
        
        raise ValueError("No image data found in response")
        
    except Exception as e:
        raise ValueError(f"Google reference-based image generation failed: {str(e)}")
