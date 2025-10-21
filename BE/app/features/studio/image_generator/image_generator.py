from typing import Any, Dict, List

from fastapi import HTTPException, status

from app.shared.database.supabase_client import supabase
from app.shared.image.base import Provider, generate_image, generate_image_from_reference
from app.shared.image.image_config import (
    DEFAULT_IMAGE_MODEL,
    DEFAULT_IMAGE_PROVIDER,
)


class ImageGeneratorService:
    """Generate and store images for storybook pages using existing base interface."""

    def __init__(self) -> None:
        # Resolve defaults from config
        self.provider: Provider = Provider(DEFAULT_IMAGE_PROVIDER)
        self.model: str = DEFAULT_IMAGE_MODEL

    def generate_missing_images(self, storybook_id: str) -> Dict[str, Any]:
        """
        Generate images for all pages of the given storybook that have an image_prompt
        but no image_url yet. Stores images under path "{storybook_id}/{page_number}".

        Returns a structured summary with per-page results.
        """
        try:
            # Validate storybook exists
            storybook_check = (
                supabase.table("storybooks").select("id,title").eq("id", storybook_id).execute()
            )
            if not storybook_check.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Storybook not found",
                )

            # Fetch all pages for this storybook
            pages_res = (
                supabase.table("pages")
                .select("id,page_number,image_prompt,image_url")
                .eq("storybook_id", storybook_id)
                .order("page_number")
                .execute()
            )
            pages: List[Dict[str, Any]] = pages_res.data or []

            # === NEW: 첫 번째 생성된 이미지를 레퍼런스로 사용 ===
            reference_image_url = None
            for page in pages:
                if page.get("image_url"):
                    reference_image_url = page["image_url"]
                    break  # 첫 번째만

            processed = 0
            succeeded = 0
            failed: List[Dict[str, Any]] = []
            skipped: List[Dict[str, Any]] = []
            page_results: List[Dict[str, Any]] = []

            for page in pages:
                page_id = page.get("id")
                page_number = page.get("page_number")
                image_prompt = (page.get("image_prompt") or "").strip()
                image_url_existing = (page.get("image_url") or "").strip()

                # Skip if already has image_url
                if image_url_existing:
                    skipped.append({
                        "page_number": page_number,
                        "reason": "image_url already present",
                    })
                    continue

                # Skip if no prompt
                if not image_prompt:
                    skipped.append({
                        "page_number": page_number,
                        "reason": "missing image_prompt",
                    })
                    continue

                processed += 1

                try:
                    custom_path = f"{storybook_id}/{page_number}"
                    
                    # === NEW: 조건부 이미지 생성 ===
                    if reference_image_url:
                        # 레퍼런스 이미지가 있으면 레퍼런스 기반 생성
                        result = generate_image_from_reference(
                            provider=self.provider,
                            model=self.model,
                            prompt=image_prompt,
                            reference_url=reference_image_url,
                            custom_path=custom_path,
                        )
                    else:
                        # 첫 이미지는 레퍼런스 없이 생성
                        result = generate_image(
                            provider=self.provider,
                            model=self.model,
                            prompt=image_prompt,
                            custom_path=custom_path,
                        )

                    # Update DB with generated URL
                    update_res = (
                        supabase.table("pages")
                        .update({"image_url": result.url})
                        .eq("id", page_id)
                        .execute()
                    )

                    if not update_res.data:
                        failed.append({
                            "page_number": page_number,
                            "reason": "DB update returned empty data",
                        })
                        continue

                    succeeded += 1
                    page_results.append({
                        "page_number": page_number,
                        "image_url": result.url,
                        "storage_path": result.storage_path,
                        "file_size": result.file_size,
                        "mime_type": result.mime_type,
                    })
                    
                    # === NEW: 첫 이미지를 레퍼런스로 설정 ===
                    if not reference_image_url:
                        reference_image_url = result.url

                except HTTPException:
                    raise
                except Exception as e:  # provider or upload failure
                    failed.append({
                        "page_number": page_number,
                        "reason": str(e),
                    })

            return {
                "storybook_id": storybook_id,
                "processed": processed,
                "succeeded": succeeded,
                "failed_count": len(failed),
                "skipped_count": len(skipped),
                "failed": failed,
                "skipped": skipped,
                "pages": page_results,
                "message": f"Generated {succeeded} images. Failed {len(failed)}. Skipped {len(skipped)}.",
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate images: {str(e)}",
            )


# Singleton instance
image_generator_service = ImageGeneratorService()


