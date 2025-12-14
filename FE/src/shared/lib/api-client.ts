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
      throw new Error((errorData as any).detail || `Request failed (${response.status})`);
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
      throw new Error((errorData as any).detail || `Request failed (${response.status})`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, body: any, token?: string): Promise<T> {
    const url = getApiUrl(endpoint);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const resolvedToken = token ?? (authTokenProvider ? await authTokenProvider() : undefined);
    if (resolvedToken) headers['Authorization'] = `Bearer ${resolvedToken}`;
    
    const response = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle FastAPI validation errors
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const validationErrors = errorData.detail.map((err: any) => 
          `${err.loc?.join('.')}: ${err.msg}`
        ).join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }
      
      throw new Error((errorData as any).detail || `Request failed (${response.status})`);
    }
    return response.json();
  },

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const url = getApiUrl(endpoint);
    const headers: Record<string, string> = {};
    const resolvedToken = token ?? (authTokenProvider ? await authTokenProvider() : undefined);
    if (resolvedToken) headers['Authorization'] = `Bearer ${resolvedToken}`;
    const response = await fetch(url, { method: 'DELETE', headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as any).detail || `Request failed (${response.status})`);
    }
    return response.json();
  },

  async postFormData<T>(endpoint: string, formData: FormData, token?: string): Promise<T> {
    const url = getApiUrl(endpoint);
    
    const headers: Record<string, string> = {};
    // Do NOT set Content-Type for FormData - browser will set it with boundary
    
    const resolvedToken = token ?? (authTokenProvider ? await authTokenProvider() : undefined);
    if (resolvedToken) {
      headers['Authorization'] = `Bearer ${resolvedToken}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as any).detail || `Request failed (${response.status})`);
    }

    return response.json();
  },
};