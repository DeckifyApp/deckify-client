import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  api,
  type ApiUser,
  type AuthPayload,
  setApiSession,
  setApiSessionListener,
} from '../services/api';

type AuthContextValue = {
  accessToken: string | null;
  deleteAccount: () => Promise<void>;
  error: string | null;
  initialized: boolean;
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
const SESSION_KEY = 'deckify.session';

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

async function readStoredSession(): Promise<Session | null> {
  const value =
    Platform.OS === 'web'
      ? sessionStorage.getItem(SESSION_KEY)
      : await SecureStore.getItemAsync(SESSION_KEY);

  if (!value) {
    return null;
  }

  try {
    const session = JSON.parse(value) as Partial<Session>;
    return typeof session.accessToken === 'string' &&
      typeof session.refreshToken === 'string' &&
      typeof session.user?.id === 'string'
      ? (session as Session)
      : null;
  } catch {
    return null;
  }
}

async function writeStoredSession(session: Session | null): Promise<void> {
  if (Platform.OS === 'web') {
    if (session) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return;
  }

  if (session) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const applySession = useCallback((payload: AuthPayload | null) => {
    setApiSession(payload);
    const nextSession = payload ? toSession(payload) : null;
    setSession(nextSession);
    void writeStoredSession(nextSession).catch(() => undefined);
  }, []);

  useEffect(() => {
    setApiSessionListener(applySession);

    return () => setApiSessionListener(null);
  }, [applySession]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const stored = await readStoredSession();
        if (stored) {
          const refreshed = await api.auth.refresh(stored.refreshToken);
          if (active) {
            applySession(refreshed);
          }
        }
      } catch {
        if (active) {
          applySession(null);
        }
      } finally {
        if (active) {
          setInitialized(true);
        }
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, [applySession]);

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

  const deleteAccount = useCallback(async () => {
    setError(null);
    await api.users.deleteMe();
    applySession(null);
  }, [applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      deleteAccount,
      error,
      initialized,
      isAuthenticated: Boolean(session),
      loading,
      login,
      logout,
      refreshToken: session?.refreshToken ?? null,
      register,
      updateProfile,
      user: session?.user ?? null,
    }),
    [
      deleteAccount,
      error,
      initialized,
      loading,
      login,
      logout,
      register,
      session,
      updateProfile,
    ],
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
