import { useState } from 'react';
import { apiClient } from '../../../shared/lib/api-client';

// Waitlist API types
export interface WaitlistResponse {
  id: string;
  email: string;
  message: string;
}

// Waitlist API hook
export function useWaitlistApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToWaitlist = async (email: string): Promise<WaitlistResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<WaitlistResponse>('waitlist/', { email });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit email';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    addToWaitlist,
    isLoading,
    error,
    clearError,
  };
}

// Direct API functions (without hooks)
export const waitlistApi = {
  async addToWaitlist(email: string): Promise<WaitlistResponse> {
    return apiClient.post<WaitlistResponse>('waitlist/', { email });
  },
};
