import { useEffect, useState } from 'react';
import { familyApi } from '../api';
import { Character, PresetCharactersResponse } from '../types';

export function usePresetCharacters() {
  const [presets, setPresets] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data: PresetCharactersResponse = await familyApi.getPresetCharacters();
        if (isActive) setPresets(data.presets);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load preset characters';
        if (isActive) setError(message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    load();
    return () => {
      isActive = false;
    };
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PresetCharactersResponse = await familyApi.getPresetCharacters();
      setPresets(data.presets);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load preset characters';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { presets, isLoading, error, refetch, clearError };
}


