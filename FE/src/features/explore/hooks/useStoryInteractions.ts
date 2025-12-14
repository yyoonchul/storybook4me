import { useEffect, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { exploreApi } from '../api';

export function useStoryInteractions() {
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());
  const { session } = useSession();

  // Initialize liked stories from localStorage for persistence across refreshes
  useEffect(() => {
    try {
      const raw = localStorage.getItem('explore_liked_story_ids');
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        setLikedStories(new Set(arr));
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, []);

  const persistLiked = (setRef: Set<string>) => {
    try {
      localStorage.setItem('explore_liked_story_ids', JSON.stringify(Array.from(setRef)));
    } catch (e) {
      // ignore quota errors
    }
  };

  const toggleLike = async (storybookId: string) => {
    if (!session) return;

    try {
      const token = await session.getToken({ template: 'storybook4me' });
      const response = await exploreApi.toggleLike(storybookId, token || undefined);
      
      setLikedStories(prev => {
        const newSet = new Set(prev);
        if (response.liked) {
          newSet.add(storybookId);
        } else {
          newSet.delete(storybookId);
        }
        persistLiked(newSet);
        return newSet;
      });

      return response;
    } catch (e) {
      console.error('Failed to toggle like:', e);
      throw e;
    }
  };

  const incrementView = async (storybookId: string) => {
    try {
      const response = await exploreApi.incrementViewCount(storybookId);
      return response;
    } catch (e) {
      console.error('Failed to increment view count:', e);
      throw e;
    }
  };

  const isLiked = (storybookId: string) => {
    return likedStories.has(storybookId);
  };

  return {
    toggleLike,
    incrementView,
    isLiked
  };
}
