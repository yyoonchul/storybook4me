import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@clerk/clerk-react';
import { exploreApi } from '../api';
import { ExploreStoriesResponse, ExploreStoriesRequest, SortType } from '../types';

export function useExploreStories(initialParams: ExploreStoriesRequest = {}) {
  const [stories, setStories] = useState<ExploreStoriesResponse['stories']>([]);
  const [pagination, setPagination] = useState<ExploreStoriesResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ExploreStoriesRequest>(initialParams);
  const { session } = useSession();

  const fetchStories = useCallback(async (newParams?: ExploreStoriesRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = session ? await session.getToken({ template: 'storybook4me' }) : null;
      const currentParams = newParams || params;
      const response = await exploreApi.getStories(currentParams, token || undefined);
      
      setStories(response.stories);
      setPagination(response.pagination);
      
      if (newParams) {
        setParams(currentParams);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load stories';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [session, params]);

  useEffect(() => {
    const initializeStories = async () => {
      try {
        await fetchStories();
      } catch (error) {
        console.error('Failed to initialize stories:', error);
      }
    };

    initializeStories();
  }, [fetchStories]); // fetchStories가 변경될 때 실행

  const loadMore = useCallback(async () => {
    if (!pagination?.hasNext) return;
    
    try {
      const token = session ? await session.getToken({ template: 'storybook4me' }) : null;
      const response = await exploreApi.getStories(
        { ...params, page: (pagination?.page || 1) + 1 },
        token || undefined
      );
      
      setStories(prev => [...prev, ...response.stories]);
      setPagination(response.pagination);
    } catch (e) {
      console.error('Failed to load more stories:', e);
    }
  }, [session, params, pagination]);

  const refresh = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  return {
    stories,
    pagination,
    isLoading,
    error,
    loadMore,
    refresh,
    fetchStories
  };
}
