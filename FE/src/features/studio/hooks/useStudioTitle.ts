import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { studioDataApi } from '../api/data';
import type { SaveStatus, StorybookTitle } from '../types/data';

export function useStudioTitle(storybookId: string | undefined) {
  const { isLoaded, session } = useSession();
  const [title, setTitle] = useState<string>('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // initial fetch
  useEffect(() => {
    if (!storybookId || !isLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        setIsFetching(true);
        const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
        const res: StorybookTitle = await studioDataApi.getTitle(storybookId, token);
        if (!cancelled) setTitle(res.title ?? '');
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load title');
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storybookId, isLoaded, session]);

  const saveNow = useCallback(async (nextTitle: string) => {
    if (!storybookId) return;
    setStatus('saving');
    setError(null);
    try {
      const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
      const res = await studioDataApi.updateTitle(storybookId, { title: nextTitle }, token);
      setTitle(res.title);
      setStatus('saved');
      // revert to idle after a short moment
      window.setTimeout(() => setStatus('idle'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to save title');
      setStatus('error');
    }
  }, [storybookId, session]);

  const updateTitle = useCallback((nextTitle: string) => {
    setTitle(nextTitle);
    setError(null);
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      // Only mark as saving when the actual request is about to fire
      saveNow(nextTitle);
    }, 1000);
  }, [saveNow]);

  useEffect(() => () => {
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
  }, []);

  const state = useMemo(() => ({ title, status, error, isFetching }), [title, status, error, isFetching]);
  return { ...state, setTitle: updateTitle, saveNow };
}


