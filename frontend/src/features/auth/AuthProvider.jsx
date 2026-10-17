import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../../api/auth.js';
import { registerSessionHandlers } from '../../api/client.js';
import { tokenStorage } from '../../api/tokenStorage.js';
import { PATHS } from '../../config/navigation.js';
import { hasPermission } from '../../config/permissions.js';
import { AuthContext } from '../../hooks/useAuth.js';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(() => !tokenStorage.get());

  const startSession = useCallback(({ token, user: sessionUser }) => {
    tokenStorage.set(token);
    setUser(sessionUser);
  }, []);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // Expired sessions are cleared by the 401 handler; other failures keep the stored token for the next visit.
  const refreshUser = useCallback(
    () =>
      authApi
        .me()
        .then(({ data }) => setUser(data))
        .catch(() => {}),
    [],
  );

  useEffect(() => {
    registerSessionHandlers({ onExpired: clearSession, onPasswordChangeRequired: refreshUser });
    if (tokenStorage.get()) refreshUser().finally(() => setIsReady(true));
  }, [clearSession, refreshUser]);

  const login = useCallback(
    async (credentials) => {
      const { data } = await authApi.login(credentials);
      startSession(data);
    },
    [startSession],
  );

  const changePassword = useCallback(
    async (passwords) => {
      const response = await authApi.changePassword(passwords);
      startSession(response.data);
      return response;
    },
    [startSession],
  );

  // Navigating and clearing the user in one transition stops protected pages from redirecting to login first.
  const logout = useCallback(
    () =>
      startTransition(() => {
        navigate(PATHS.home, { replace: true });
        clearSession();
      }),
    [navigate, clearSession],
  );

  const value = useMemo(
    () => ({
      user,
      isReady,
      login,
      logout,
      changePassword,
      refreshUser,
      can: (permission) => hasPermission(user, permission),
    }),
    [user, isReady, login, logout, changePassword, refreshUser],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};
