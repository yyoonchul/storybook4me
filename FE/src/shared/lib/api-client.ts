import { getApiUrl } from './api-config';

// Simple API client
export const apiClient = {
  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = getApiUrl(endpoint);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Request failed');
    }

    return response.json();
  },
};
