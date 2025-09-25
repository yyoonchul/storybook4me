"""
Storybook API endpoints as per .cursor/API.md (My Bookshelf section).
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.features.auth.deps import get_current_user_id
from .models import (
    StorybookListResponse,
    StorybookResponse,
    CreateStorybookRequest,
    UpdateStorybookRequest,
    UpdateVisibilityRequest,
    DeleteResponse,
)
from .services import storybook_service


router = APIRouter()


@router.get("", response_model=StorybookListResponse)
async def list_storybooks(
    current_user_id: str = Depends(get_current_user_id),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc")
):
    return storybook_service.list_storybooks(current_user_id, page=page, limit=limit, sort=sort, order=order)


@router.post("", response_model=StorybookResponse)
async def create_storybook(req: CreateStorybookRequest, current_user_id: str = Depends(get_current_user_id)):
    storybook = storybook_service.create_storybook(current_user_id, req)
    return StorybookResponse(storybook=storybook)


@router.get("/{storybook_id}", response_model=StorybookResponse)
async def get_storybook(storybook_id: str, current_user_id: str = Depends(get_current_user_id)):
    storybook = storybook_service.get_storybook(current_user_id, storybook_id)
    return StorybookResponse(storybook=storybook)


@router.put("/{storybook_id}", response_model=StorybookResponse)
async def update_storybook(storybook_id: str, req: UpdateStorybookRequest, current_user_id: str = Depends(get_current_user_id)):
    storybook = storybook_service.update_storybook(current_user_id, storybook_id, req)
    return StorybookResponse(storybook=storybook)


@router.put("/{storybook_id}/visibility", response_model=StorybookResponse)
async def set_visibility(storybook_id: str, req: UpdateVisibilityRequest, current_user_id: str = Depends(get_current_user_id)):
    storybook = storybook_service.set_visibility(current_user_id, storybook_id, req.is_public)
    return StorybookResponse(storybook=storybook)


@router.delete("/{storybook_id}", response_model=DeleteResponse)
async def delete_storybook(storybook_id: str, current_user_id: str = Depends(get_current_user_id)):
    storybook_service.delete_storybook(current_user_id, storybook_id)
    return DeleteResponse(message="Storybook deleted successfully")


