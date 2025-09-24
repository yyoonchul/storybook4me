import { getApiUrl } from './api-config';

let authTokenProvider: (() => Promise<string | null>) | null = null;

export function setAuthTokenProvider(provider: () => Promise<string | null>) {
  authTokenProvider = provider;
}

// Simple API client
export const apiClient = {
  async post<T>(endpoint: string, body: any, token?: string): Promise<T> {
    const url = getApiUrl(endpoint);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const resolvedToken = token ?? (authTokenProvider ? await authTokenProvider() : undefined);
    if (resolvedToken) {
      headers['Authorization'] = `Bearer ${resolvedToken}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Request failed');
    }

    return response.json();
  },

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const url = getApiUrl(endpoint);
    
    const headers: Record<string, string> = {};
    
    const resolvedToken = token ?? (authTokenProvider ? await authTokenProvider() : undefined);
    if (resolvedToken) {
      headers['Authorization'] = `Bearer ${resolvedToken}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Request failed');
    }

    return response.json();
  },
};

// Authed API client (Clerk token injected automatically)
// Usage: const client = await createAuthedApiClient(getTokenFn); client.post('endpoint', body)
export async function createAuthedApiClient(getToken: () => Promise<string | null>) {
  const token = await getToken();
  return {
    get: async <T>(endpoint: string): Promise<T> => apiClient.get<T>(endpoint, token || undefined),
    post: async <T>(endpoint: string, body: any): Promise<T> => apiClient.post<T>(endpoint, body, token || undefined),
  };
}
