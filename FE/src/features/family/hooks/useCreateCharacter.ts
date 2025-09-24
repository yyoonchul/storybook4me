import { useState } from 'react';
import { familyApi } from '../api';
import { CharacterResponse, CreateCharacterRequest } from '../types';

export function useCreateCharacter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCharacter = async (payload: CreateCharacterRequest): Promise<CharacterResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
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


