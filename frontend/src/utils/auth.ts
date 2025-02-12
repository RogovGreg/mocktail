interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }
  
  export const storeTokens = (tokens: AuthTokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('tokenExpiry', (Date.now() + tokens.expiresIn * 1000).toString());
  };
  
  export const getStoredTokens = () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    tokenExpiry: localStorage.getItem('tokenExpiry'),
  });
  
  export const refreshTokens = async (email: string): Promise<boolean> => {
    const { refreshToken } = getStoredTokens();
    
    if (!refreshToken) {
      return false;
    }
  
    try {
      const response = await fetch('/api/v1/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          refreshToken,
        }),
      });
  
      if (!response.ok) {
        return false;
      }
  
      const tokens = await response.json();
      storeTokens(tokens);
      return true;
    } catch {
      return false;
    }
  };