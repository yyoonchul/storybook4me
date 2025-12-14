import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { studioDataApi } from '../api/data';
import type { SaveStatus, PageContent, UpdatePageContentRequest } from '../types/data';

export function usePageContent(storybookId: string | undefined, pageNumber: number | undefined) {
  const { isLoaded, session } = useSession();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
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
        const res: PageContent = await studioDataApi.getPageContent(storybookId, pageNumber, token);
        if (!cancelled) setPageContent(res);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load page content');
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [storybookId, pageNumber, isLoaded]);

  const saveNow = useCallback(async (updates: UpdatePageContentRequest) => {
    if (!storybookId || !pageNumber) return;
    setStatus('saving');
    setError(null);
    try {
      const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
      const res = await studioDataApi.updatePageContent(storybookId, pageNumber, updates, token);
      setPageContent(res);
      setStatus('saved');
      // revert to idle after a short moment
      window.setTimeout(() => setStatus('idle'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to save page content');
      setStatus('error');
    }
  }, [storybookId, pageNumber]);

  const updatePageContent = useCallback((updates: UpdatePageContentRequest) => {
    setError(null);
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      // Only mark as saving when the actual request is about to fire
      saveNow(updates);
    }, 1000);
  }, [saveNow]);

  // Helper functions for updating specific fields
  const updateScriptText = useCallback((scriptText: string) => {
    updatePageContent({ script_text: scriptText });
  }, [updatePageContent]);

  const updateImagePrompt = useCallback((imagePrompt: string) => {
    updatePageContent({ image_prompt: imagePrompt });
  }, [updatePageContent]);

  const updateImageStyle = useCallback((imageStyle: string) => {
    updatePageContent({ image_style: imageStyle });
  }, [updatePageContent]);

  const updateCharacterIds = useCallback((characterIds: string[]) => {
    updatePageContent({ character_ids: characterIds });
  }, [updatePageContent]);

  const updateBackgroundDescription = useCallback((backgroundDescription: string) => {
    updatePageContent({ background_description: backgroundDescription });
  }, [updatePageContent]);

  useEffect(() => () => {
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
  }, []);

  const state = useMemo(() => ({ 
    pageContent, 
    status, 
    error, 
    isFetching 
  }), [pageContent, status, error, isFetching]);

  return { 
    ...state, 
    updatePageContent,
    updateScriptText,
    updateImagePrompt,
    updateImageStyle,
    updateCharacterIds,
    updateBackgroundDescription,
    saveNow
  };
}
