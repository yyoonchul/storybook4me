import { useState, useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
import { exploreApi } from '../api';
import { CategoryInfo } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = session ? await session.getToken({ template: 'storybook4me' }) : null;
      const response = await exploreApi.getCategories(token || undefined);
      setCategories(response.categories);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load categories';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); // 컴포넌트 마운트 시에만 실행

  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories
  };
}
