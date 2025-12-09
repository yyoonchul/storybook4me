"""
End-to-end storybook generation workflow used by Studio.
"""

from typing import List, Dict, Any

from fastapi import HTTPException, status

from app.features.storybook.models import CreateStorybookRequest, Storybook
from app.features.storybook.services import storybook_service
from app.shared.database.supabase_client import supabase

from ..models.generate import GenerateStorybookRequest
from .arc import generate_story_arc
from .bible import generate_story_bible
from .draft import generate_final_script


def _create_storybook_record(user_id: str, payload: GenerateStorybookRequest) -> Storybook:
    """Create a base storybook row with creation_params from Studio settings."""
    try:
        create_req = CreateStorybookRequest(
            title=payload.title or "",
            character_ids=payload.character_ids,
            theme=payload.theme,
            style=payload.style,
            page_count=payload.page_count,
            prompt=payload.prompt,
        )
        return storybook_service.create_storybook(user_id, create_req)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create storybook: {exc}",
        )


def _persist_spreads_as_pages(
    storybook_id: str,
    spreads: List[Dict[str, Any]],
) -> int:
    """
    Write generated spreads into the pages table as individual pages.
    Returns the resulting page count.
    """
    page_rows = []
    for spread in spreads:
        spread_number = spread["spread_number"]
        left_page_number = (spread_number - 1) * 2 + 1
        right_page_number = left_page_number + 1

        page_rows.append(
            {
                "storybook_id": storybook_id,
                "page_number": left_page_number,
                "script_text": spread.get("script_1"),
            }
        )
        page_rows.append(
            {
                "storybook_id": storybook_id,
                "page_number": right_page_number,
                "script_text": spread.get("script_2"),
            }
        )

    # Insert all pages in one call
    res = supabase.table("pages").insert(page_rows).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to persist generated pages",
        )

    # Update storybook page_count
    supabase.table("storybooks").update({"page_count": len(page_rows)}).eq("id", storybook_id).execute()
    return len(page_rows)


def generate_storybook_with_script(user_id: str, payload: GenerateStorybookRequest) -> Storybook:
    """
    Create a storybook and generate bible, arc, and draft script.
    Returns the storybook with pages populated.
    """
    if not payload.prompt or not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt is required to generate a storybook.",
        )

    # 1) Create storybook base row
    storybook = _create_storybook_record(user_id, payload)

    # 2) Generate supporting content (bible, arc)
    try:
        generate_story_bible(storybook.id)
        generate_story_arc(storybook.id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate story context: {exc}",
        )

    # 3) Generate final script (14 spreads)
    try:
        final_script = generate_final_script(storybook.id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate final script: {exc}",
        )

    # 4) Persist spreads into pages table
    spreads_dicts = [spread.model_dump() for spread in final_script.spreads]
    _persist_spreads_as_pages(storybook.id, spreads_dicts)

    # 5) Return hydrated storybook with pages
    return storybook_service.get_storybook(user_id, storybook.id)

