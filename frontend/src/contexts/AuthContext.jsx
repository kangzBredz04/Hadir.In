import { useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/auth.service.js';
import {
  AUTH_UNAUTHORIZED_EVENT,
  tokenStorage,
} from '../utils/tokenStorage.js';
import { AuthContext } from './authContext.js';

const ALLOWED_ROLES = ['ADMIN', 'EMPLOYEE'];

function hasValidRole(user) {
  return ALLOWED_ROLES.includes(user?.role);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const clearSession = useCallback(() => {
    tokenStorage.remove();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = tokenStorage.get();

      if (!token) {
        if (active) setIsInitializing(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();

        if (!hasValidRole(currentUser)) {
          throw new Error('Role pengguna tidak tersedia.');
        }

        if (active) setUser(currentUser);
      } catch {
        tokenStorage.remove();
        if (active) setUser(null);
      } finally {
        if (active) setIsInitializing(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, clearSession);
  }, [clearSession]);

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials);

    if (!result.token) {
      throw new Error('Token login tidak ditemukan.');
    }

    tokenStorage.set(result.token);

    try {
      const verifiedUser = await authService.getCurrentUser();

      if (!hasValidRole(verifiedUser)) {
        throw new Error('Role pengguna tidak ditemukan.');
      }

      setUser(verifiedUser);
      return verifiedUser;
    } catch (error) {
      tokenStorage.remove();
      setUser(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && tokenStorage.get()),
      isInitializing,
      login,
      logout,
    }),
    [isInitializing, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
