"""
FastAPI endpoints for storybook rewrite operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.features.auth.deps import get_current_user_id

from .models import (
    ChatRequest,
    ChatResponse,
    RewriteScriptRequest,
    RewriteScriptResponse,
)
from .output_schemas.draft import FinalScriptSchema
from .services.chat import answer_question, classify_message
from .services.rewrite import rewrite_full_script, rewrite_full_script_with_summary


router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Respond to a Studio chat message with either an answer or rewritten script",
)
async def handle_studio_chat(
    payload: ChatRequest,
    current_user_id: str = Depends(get_current_user_id),
) -> ChatResponse:
    """
    Unified chat endpoint used by the Studio.

    - Classifies the user's message (edit vs question) via LLM structured output.
    - Answers questions directly using the current story context.
    - Performs a full rewrite (with change summary) when modifications are requested.
    """
    if payload.script.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to interact with this storybook.",
        )

    try:
        classification = classify_message(
            payload.message,
            user_id=current_user_id,
        )
    except Exception as exc:  # pragma: no cover - LLM failures are rare but possible
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to classify the chat message.",
        ) from exc

    if classification.action == "question":
        try:
            assistant_message = answer_question(
                payload.script,
                payload.message,
                user_id=current_user_id,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate an answer for the question.",
            ) from exc
        return ChatResponse(
            assistant_message=assistant_message,
            action="question"
        )

    # classification.action == "edit"
    try:
        rewrite_result = rewrite_full_script_with_summary(
            script_data=payload.script.model_dump(),
            edit_request=payload.message,
            requesting_user_id=current_user_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:  # pragma: no cover
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to rewrite storybook script.",
        ) from exc

    updated_script = FinalScriptSchema.model_validate(
        rewrite_result.model_dump(exclude={"change_summary"})
    )
    return ChatResponse(
        assistant_message=rewrite_result.change_summary,
        action="edit",
        script=updated_script,
    )


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
            requesting_user_id=current_user_id,
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


