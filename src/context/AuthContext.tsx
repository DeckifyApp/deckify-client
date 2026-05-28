import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  api,
  type ApiUser,
  type AuthPayload,
  setApiSession,
  setApiSessionListener,
} from '../services/api';

type AuthContextValue = {
  accessToken: string | null;
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: string | null;
  register: (input: {
    email: string;
    name: string;
    password: string;
  }) => Promise<void>;
  updateProfile: (input: {
    avatarUrl?: string | null;
    name?: string;
  }) => Promise<void>;
  user: ApiUser | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Session = {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
};

function toSession(payload: AuthPayload): Session {
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: payload.user,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applySession = useCallback((payload: AuthPayload | null) => {
    setApiSession(payload);
    setSession(payload ? toSession(payload) : null);
  }, []);

  useEffect(() => {
    setApiSessionListener((payload) => {
      setSession(payload ? toSession(payload) : null);
    });

    return () => setApiSessionListener(null);
  }, []);

  const register = useCallback(
    async (input: { email: string; name: string; password: string }) => {
      setError(null);
      setLoading(true);
      try {
        const payload = await api.auth.register(input);
        applySession(payload);
      } catch (currentError) {
        const message =
          currentError instanceof Error
            ? currentError.message
            : 'Nao foi possivel criar a conta.';
        setError(message);
        throw currentError;
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      setError(null);
      setLoading(true);
      try {
        const payload = await api.auth.login(input);
        applySession(payload);
      } catch (currentError) {
        const message =
          currentError instanceof Error
            ? currentError.message
            : 'Nao foi possivel entrar.';
        setError(message);
        throw currentError;
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    const token = session?.refreshToken;
    setError(null);

    if (token) {
      try {
        await api.auth.logout(token);
      } catch {
        // The local session should still be cleared if the server token is already invalid.
      }
    }

    applySession(null);
  }, [applySession, session?.refreshToken]);

  const updateProfile = useCallback(
    async (input: { avatarUrl?: string | null; name?: string }) => {
      setError(null);
      const user = await api.users.updateMe(input);
      setSession((current) => (current ? { ...current, user } : current));
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      error,
      isAuthenticated: Boolean(session),
      loading,
      login,
      logout,
      refreshToken: session?.refreshToken ?? null,
      register,
      updateProfile,
      user: session?.user ?? null,
    }),
    [error, loading, login, logout, register, session, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
