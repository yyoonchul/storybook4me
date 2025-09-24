import { useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { familyApi } from '../api';
import { setAuthTokenProvider } from '@/shared/lib/api-client';
import { CharacterResponse, CreateCharacterRequest } from '../types';

export function useCreateCharacter() {
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCharacter = async (payload: CreateCharacterRequest): Promise<CharacterResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Register global token provider once; apiClient will inject token automatically
      setAuthTokenProvider(() => session?.getToken() ?? Promise.resolve(null));
      const res = await familyApi.createCharacter(payload);
      return res;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create character';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { createCharacter, isLoading, error, clearError };
}


