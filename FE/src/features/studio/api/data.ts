import { apiClient } from '@/shared/lib/api-client';
import type { StorybookTitle, UpdateTitleRequest, PageContent, UpdatePageContentRequest, StorybookData } from '../types/data';

export const studioDataApi = {
  async getTitle(storybookId: string, token?: string): Promise<StorybookTitle> {
    return apiClient.get(`/studio/storybooks/${storybookId}/title`, token);
  },

  async updateTitle(storybookId: string, req: UpdateTitleRequest, token?: string): Promise<StorybookTitle> {
    return apiClient.put(`/studio/storybooks/${storybookId}/title`, req, token);
  },

  async getPageContent(storybookId: string, pageNumber: number, token?: string): Promise<PageContent> {
    return apiClient.get(`/studio/storybooks/${storybookId}/pages/${pageNumber}`, token);
  },

  async updatePageContent(storybookId: string, pageNumber: number, req: UpdatePageContentRequest, token?: string): Promise<PageContent> {
    return apiClient.put(`/studio/storybooks/${storybookId}/pages/${pageNumber}`, req, token);
  },

  async getStorybook(storybookId: string, token?: string): Promise<StorybookData> {
    return apiClient.get(`/storybooks/${storybookId}`, token);
  },
};


