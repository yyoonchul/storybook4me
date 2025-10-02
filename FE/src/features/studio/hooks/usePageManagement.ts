import { useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { studioDataApi } from '../api/data';
import type { AddPageRequest, AddPageResponse, DeletePageResponse } from '../types/data';

export function usePageManagement(storybookId: string | undefined) {
  const { session } = useSession();
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addPage = async (content: AddPageRequest['content']) => {
    if (!storybookId) {
      setError('Storybook ID is required');
      return null;
    }

    setIsAdding(true);
    setError(null);

    try {
      const token = await session?.getToken({ template: 'storybook4me' });
      const response: AddPageResponse = await studioDataApi.addPage(
        storybookId,
        { content },
        token || undefined
      );
      return response.page;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add page';
      setError(errorMessage);
      return null;
    } finally {
      setIsAdding(false);
    }
  };

  const deletePage = async (pageNumber: number) => {
    if (!storybookId) {
      setError('Storybook ID is required');
      return false;
    }

    setIsDeleting(pageNumber);
    setError(null);

    try {
      const token = await session?.getToken({ template: 'storybook4me' });
      const response: DeletePageResponse = await studioDataApi.deletePage(
        storybookId,
        pageNumber,
        token || undefined
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete page';
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    addPage,
    deletePage,
    isAdding,
    isDeleting,
    error,
    clearError,
  };
}

