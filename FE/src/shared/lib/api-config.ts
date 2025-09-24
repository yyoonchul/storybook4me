// Simple API Configuration
const getBaseUrl = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT || 'local';
  
  switch (environment) {
    case 'production':
      return 'https://storybook-production-13f9.up.railway.app';
    case 'preview':
      return 'https://storybook-preview.up.railway.app';
    case 'local':
    default:
      return 'http://localhost:8000';
  }
};

export const getApiUrl = (endpoint: string) => {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/api/${cleanEndpoint}`;
};
