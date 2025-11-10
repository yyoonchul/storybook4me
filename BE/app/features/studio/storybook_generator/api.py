"""
FastAPI endpoints for storybook rewrite operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.features.auth.deps import get_current_user_id

from .models import RewriteScriptRequest, RewriteScriptResponse
from .output_schemas.draft import FinalScriptSchema
from .services.rewrite import rewrite_full_script


router = APIRouter()


@router.post(
    "/rewrite",
    response_model=RewriteScriptResponse,
    summary="Rewrite a full storybook script",
)
async def rewrite_storybook_script(
    payload: RewriteScriptRequest,
    current_user_id: str = Depends(get_current_user_id),
) -> RewriteScriptResponse:
    """
    Rewrites a complete storybook script using the full-script rewrite service.

    The client supplies the current script and edit instructions. The rewritten
    script is returned without persisting changes to the database. Automatic
    saving is handled elsewhere in the Studio feature.
    """
    # Ensure the requester matches the script's owner for basic authorization.
    if payload.script.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to rewrite this storybook.",
        )

    try:
        rewritten_script_data = rewrite_full_script(
            script_data=payload.script.model_dump(),
            edit_request=payload.edit_request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:  # pragma: no cover - safeguard for unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to rewrite storybook script.",
        ) from exc

    rewritten_script = FinalScriptSchema.model_validate(rewritten_script_data)
    return RewriteScriptResponse(script=rewritten_script)


