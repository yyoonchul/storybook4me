import { apiClient } from '@/shared/lib/api-client';
import { StorybookListResponse, StorybookResponse, CreateStorybookRequest, UpdateStorybookRequest, UpdateVisibilityRequest, GenerateStorybookRequest } from './types.ts';

export const storybookApi = {
  list: (
    params: { page?: number; limit?: number; sort?: 'created_at' | 'like_count'; order?: 'asc' | 'desc' } = {},
    token?: string
  ) => {
    const search = new URLSearchParams();
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    if (params.sort) search.set('sort', params.sort);
    if (params.order) search.set('order', params.order);
    const endpoint = search.toString() ? `storybooks?${search.toString()}` : 'storybooks';
    return apiClient.get<StorybookListResponse>(endpoint, token);
  },
  create: (body: CreateStorybookRequest, token?: string) => apiClient.post<StorybookResponse>('storybooks', body as any, token),
  generate: (body: GenerateStorybookRequest, token?: string) => apiClient.post<StorybookResponse>('studio/storybooks/generate', body as any, token),
  get: (id: string, token?: string) => apiClient.get<StorybookResponse>(`storybooks/${id}`, token),
  update: (id: string, body: UpdateStorybookRequest, token?: string) => apiClient.put<StorybookResponse>(`storybooks/${id}`, body, token),
  setVisibility: (id: string, body: UpdateVisibilityRequest, token?: string) => apiClient.put<StorybookResponse>(`storybooks/${id}/visibility`, body as any, token),
  delete: (id: string, token?: string) => apiClient.delete(`storybooks/${id}`, token),
};

