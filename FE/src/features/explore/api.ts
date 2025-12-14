import { apiClient } from '@/shared/lib/api-client';
import {
  ExploreStoriesResponse,
  ExploreCategoriesResponse,
  LikeResponse,
  ViewResponse,
  ExploreStoriesRequest
} from './types';

export const exploreApi = {
  /**
   * 공개된 동화책 목록을 검색, 필터링, 정렬하여 조회합니다.
   */
  async getStories(params: ExploreStoriesRequest = {}, token?: string) {
    const query = new URLSearchParams();
    
    if (params.q) query.append('q', params.q);
    if (params.category) query.append('category', params.category);
    if (params.tags) query.append('tags', params.tags);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));

    return apiClient.get<ExploreStoriesResponse>(
      `explore/stories?${query.toString()}`,
      token
    );
  },

  /**
   * 사용 가능한 카테고리 목록을 조회합니다.
   */
  async getCategories(token?: string) {
    return apiClient.get<ExploreCategoriesResponse>('explore/categories', token);
  },

  /**
   * 동화책에 좋아요를 추가/제거합니다.
   */
  async toggleLike(storybookId: string, token?: string) {
    return apiClient.post<LikeResponse>(
      `explore/stories/${storybookId}/like`,
      {},
      token
    );
  },

  /**
   * 동화책 조회수를 증가시킵니다.
   */
  async incrementViewCount(storybookId: string) {
    return apiClient.post<ViewResponse>(
      `explore/stories/${storybookId}/view`,
      {}
    );
  }
};
