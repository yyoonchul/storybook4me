import { useCallback, useState, useRef, useEffect } from 'react';
import { useSession } from '@clerk/clerk-react';
import { studioDataApi } from '../api/data';
import type { StorybookData, StorybookPage, SaveStatus } from '../types/data';

export function usePageEditor(storybook: StorybookData | null, currentPageIndex: number) {
  const { session } = useSession();
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const currentPage = storybook?.pages?.[currentPageIndex];

  const saveNow = useCallback(async (updates: Partial<StorybookPage>) => {
    if (!storybook || !currentPage) return;
    
    setStatus('saving');
    setError(null);
    
    try {
      const token = (await session?.getToken({ template: 'storybook4me' })) || undefined;
      
      // API 요청을 위한 데이터 변환
      const apiUpdates: any = {};
      if (updates.script_text !== undefined) apiUpdates.script_text = updates.script_text;
      if (updates.image_prompt !== undefined) apiUpdates.image_prompt = updates.image_prompt;
      if (updates.image_style !== undefined) apiUpdates.image_style = updates.image_style;
      if (updates.character_ids !== undefined) apiUpdates.character_ids = updates.character_ids;
      if (updates.background_description !== undefined) apiUpdates.background_description = updates.background_description;

      await studioDataApi.updatePageContent(
        storybook.id, 
        currentPage.page_number, 
        apiUpdates, 
        token
      );
      
      setStatus('saved');
      // revert to idle after a short moment
      window.setTimeout(() => setStatus('idle'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Failed to save page content');
      setStatus('error');
    }
  }, [storybook, currentPage, session]);

  const updatePageContent = useCallback((updates: Partial<StorybookPage>) => {
    setError(null);
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      // Only mark as saving when the actual request is about to fire
      saveNow(updates);
    }, 1000);
  }, [saveNow]);

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

  return {
    currentPage,
    status,
    error,
    updatePageContent,
    updateScriptText,
    updateImagePrompt,
    updateImageStyle,
    updateCharacterIds,
    updateBackgroundDescription,
    saveNow
  };
}
