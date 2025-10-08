from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class SortType(str, Enum):
    LATEST = "latest"
    POPULAR = "popular"
    VIEWED = "viewed"


class AuthorInfo(BaseModel):
    id: str
    name: str
    avatar_url: Optional[str] = Field(None, alias="avatarUrl")


class PublicStorybookSummary(BaseModel):
    id: str
    title: str
    cover_image_url: Optional[str] = Field(None, alias="coverImageUrl")
    author: AuthorInfo
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    like_count: int = Field(0, alias="likeCount")
    view_count: int = Field(0, alias="viewCount")
    page_count: int = Field(0, alias="pageCount")
    is_public: bool = Field(True, alias="isPublic")
    created_at: datetime = Field(alias="createdAt")

    class Config:
        populate_by_name = True


class ExploreStoriesParams(BaseModel):
    q: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    sort: SortType = SortType.LATEST
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)


class CategoryInfo(BaseModel):
    id: str
    name: str
    count: int


class PaginationInfo(BaseModel):
    page: int
    total: int
    has_next: bool = Field(alias="hasNext")
    has_prev: bool = Field(alias="hasPrev")

    class Config:
        populate_by_name = True


class ExploreStoriesResponse(BaseModel):
    stories: List[PublicStorybookSummary]
    pagination: PaginationInfo


class ExploreCategoriesResponse(BaseModel):
    categories: List[CategoryInfo]


class LikeResponse(BaseModel):
    liked: bool
    like_count: int = Field(alias="likeCount")

    class Config:
        populate_by_name = True


class ViewResponse(BaseModel):
    view_count: int = Field(alias="viewCount")

    class Config:
        populate_by_name = True
