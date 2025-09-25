import { useEffect, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { storybookApi } from '../api';
import type { StorybookSummary } from '../types';

export type BookshelfItem = { id: string; title: string; cover: string; isPublic: boolean };

export function useBookshelf() {
  const { session, isLoaded } = useSession();
  const [items, setItems] = useState<BookshelfItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !session) return;
    let mounted = true;
    setIsLoading(true);
    setError(null);
    (async () => {
      const token = await session.getToken({ template: 'storybook4me' });
      return storybookApi.list({}, token || undefined);
    })()
      .then((res) => {
        if (!mounted) return;
        const mapped: BookshelfItem[] = res.storybooks.map((sb: any) => ({
          id: sb.id,
          title: sb.title,
          cover: sb.cover_image_url || '/cover.png',
          isPublic: Boolean(sb.is_public),
        }));
        setItems(mapped);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load bookshelf');
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [isLoaded, session]);

  const removeItem = (id: string) => setItems((prev) => prev.filter((s) => s.id !== id));
  const updateVisibility = (id: string, isPublic: boolean) =>
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, isPublic } : s)));

  return { items, isLoading, error, removeItem, updateVisibility };
}


