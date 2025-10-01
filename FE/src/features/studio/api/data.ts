import { apiClient } from '@/shared/lib/api-client';
import type { StorybookTitle, UpdateTitleRequest } from '../types/data';

export const studioDataApi = {
  async getTitle(storybookId: string, token?: string): Promise<StorybookTitle> {
    return apiClient.get(`/studio/storybooks/${storybookId}/title`, token);
  },

  async updateTitle(storybookId: string, req: UpdateTitleRequest, token?: string): Promise<StorybookTitle> {
    return apiClient.put(`/studio/storybooks/${storybookId}/title`, req, token);
  },
};


