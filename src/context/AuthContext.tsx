import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'both';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verifiedSeller?: boolean;
};

type AuthContextType = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  register: (input: { name: string; email: string; password: string; role: UserRole }) => Promise<AuthUser>;
  signIn: (input: { email: string; password: string }) => Promise<AuthUser>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'local-roots-auth-session';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function loadSession(): AuthUser | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed ?? null;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null) {
  if (!canUseStorage()) return;
  if (user) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

// API functions
async function apiRequest(path: string, init?: RequestInit) {
  const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    ...init
  });

  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return (await res.json()) as any;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session) setCurrentUser(session);
  }, []);

  const register = async (input: { name: string; email: string; password: string; role: UserRole }) => {
    try {
      // Call backend API to register user
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role
        })
      });

      // Create session user with role from backend
      const sessionUser: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role || input.role, // Use backend role or fallback
        verifiedSeller: response.user.role !== 'buyer'
      };

      // Save session
      saveSession(sessionUser);
      setCurrentUser(sessionUser);
      return sessionUser;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const signIn = async (input: { email: string; password: string }) => {
    try {
      // Call backend API to login
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: input.email,
          password: input.password
        })
      });

      // Create session user with role from backend
      const sessionUser: AuthUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role || 'buyer', // Use backend role or fallback
        verifiedSeller: response.user.role !== 'buyer'
      };

      // Save session
      saveSession(sessionUser);
      setCurrentUser(sessionUser);
      return sessionUser;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signOut = () => {
    saveSession(null);
    setCurrentUser(null);
  };

  const value: AuthContextType = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      signIn,
      signOut
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

