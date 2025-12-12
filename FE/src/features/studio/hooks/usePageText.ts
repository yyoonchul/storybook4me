import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { studioDataApi } from '../api/data';
import type { SaveStatus } from '../types/data';

export function usePageText(storybookId: string | undefined, pageNumber: number | undefined) {
  const { isLoaded, session } = useSession();
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // initial fetch
  useEffect(() => {
    if (!storybookId || !pageNumber || !isLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        setIsFetching(true);
        const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
        const res = await studioDataApi.getPageContent(storybookId, pageNumber, token);
        if (!cancelled) setText(res.script_text ?? '');
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load page text');
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storybookId, pageNumber, isLoaded, session]);

  const saveNow = useCallback(async (nextText: string) => {
    if (!storybookId || !pageNumber) return;
    setStatus('saving');
    setError(null);
    try {
      const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
      const requestData = { script_text: nextText };
      const res = await studioDataApi.updatePageContent(storybookId, pageNumber, requestData, token);
      setText(res.script_text ?? '');
      setStatus('saved');
      // revert to idle after a short moment
      window.setTimeout(() => setStatus('idle'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to save page text');
      setStatus('error');
    }
  }, [storybookId, pageNumber, session]);

  const updateText = useCallback((nextText: string) => {
    setText(nextText);
    setError(null);
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      // Only mark as saving when the actual request is about to fire
      saveNow(nextText);
    }, 1000);
  }, [saveNow]);

  useEffect(() => () => {
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
  }, []);

  const state = useMemo(() => ({ text, status, error, isFetching }), [text, status, error, isFetching]);
  return { ...state, setText: updateText, saveNow };
}
