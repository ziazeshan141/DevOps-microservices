import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/commerce';
import { clearTokens, getAccessToken, saveTokens } from '../api/client';

const AuthContext = createContext(null);
const USER_KEY = 'megamart.user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(getAccessToken()));

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then((fresh) => {
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      })
      .catch(() => {
        clearTokens();
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const finishAuth = (result) => {
    saveTokens(result);
    setUser(result.user);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result.user;
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login: async (credentials) => finishAuth(await authApi.login(credentials)),
    register: async (data) => finishAuth(await authApi.register(data)),
    logout: async () => {
      const refreshToken = localStorage.getItem('megamart.refreshToken');
      try { if (refreshToken) await authApi.logout(refreshToken); } catch { /* local logout still succeeds */ }
      clearTokens();
      localStorage.removeItem(USER_KEY);
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
