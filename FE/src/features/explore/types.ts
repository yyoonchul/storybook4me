// Explore API Types - Frontend types matching backend models

export enum SortType {
  LATEST = "latest",
  POPULAR = "popular", 
  VIEWED = "viewed"
}

export interface AuthorInfo {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface PublicStorybookSummary {
  id: string;
  title: string;
  coverImageUrl?: string;
  author: AuthorInfo;
  category?: string;
  tags?: string[];
  likeCount: number;
  viewCount: number;
  pageCount: number;
  isPublic: true; // Always true for public storybooks
  createdAt: string;
}

export interface ExploreStoriesParams {
  q?: string;
  category?: string;
  tags?: string[];
  sort?: SortType;
  page?: number;
  limit?: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  count: number;
}

export interface PaginationInfo {
  page: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ExploreStoriesResponse {
  stories: PublicStorybookSummary[];
  pagination: PaginationInfo;
}

export interface ExploreCategoriesResponse {
  categories: CategoryInfo[];
}

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface ViewResponse {
  viewCount: number;
}

// Request types for API calls
export interface ExploreStoriesRequest {
  q?: string;
  category?: string;
  tags?: string;
  sort?: SortType;
  page?: number;
  limit?: number;
}
