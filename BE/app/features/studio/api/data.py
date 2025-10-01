"""
Studio API: endpoints for fetching and updating storybook title.
"""

from fastapi import APIRouter, Depends
from app.features.auth.deps import get_current_user_id
from ..models.data import StorybookTitleResponse, StorybookTitleUpdateRequest, MessageResponse
from ..services.data import studio_data_service


router = APIRouter()


@router.get("/storybooks/{storybook_id}/title", response_model=StorybookTitleResponse)
async def get_storybook_title(storybook_id: str, current_user_id: str = Depends(get_current_user_id)):
    return studio_data_service.get_storybook_title(current_user_id, storybook_id)


@router.put("/storybooks/{storybook_id}/title", response_model=StorybookTitleResponse)
async def update_storybook_title(storybook_id: str, req: StorybookTitleUpdateRequest, current_user_id: str = Depends(get_current_user_id)):
    return studio_data_service.update_storybook_title(current_user_id, storybook_id, req.title)


