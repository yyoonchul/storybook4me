import { useCallback, useEffect, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { studioDataApi } from '../api/data';
import type { StorybookData } from '../types/data';

export function useStorybook(storybookId: string | undefined) {
  const { isLoaded, session } = useSession();
  const [storybook, setStorybook] = useState<StorybookData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load storybook data
  useEffect(() => {
    if (!storybookId || !isLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
        const data: StorybookData = await studioDataApi.getStorybook(storybookId, token);
        if (!cancelled) setStorybook(data);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load storybook');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storybookId, isLoaded]);

  const refreshStorybook = useCallback(async () => {
    if (!storybookId) return;
    try {
      setIsLoading(true);
      setError(null);
      const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
      const data: StorybookData = await studioDataApi.getStorybook(storybookId, token);
      setStorybook(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to refresh storybook');
    } finally {
      setIsLoading(false);
    }
  }, [storybookId]);

  return {
    storybook,
    isLoading,
    error,
    refreshStorybook
  };
}
