import axios from 'axios';
import { getStoredTokens, refreshTokens } from './auth';

const api = axios.create({
  baseURL: '/api/v1',
});

api.interceptors.request.use(async (config: any) => {
  const { accessToken, tokenExpiry } = getStoredTokens();
  
  // Check if token is expired or will expire in next 30 seconds
  if (tokenExpiry && Number(tokenExpiry) - 30000 < Date.now()) {
    // Get user email from your app state/context
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const refreshed = await refreshTokens(userEmail);
      if (!refreshed) {
        // Handle refresh failure (e.g., redirect to login)
        window.location.href = '/login';
        return Promise.reject('Session expired');
      }
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

export default api;