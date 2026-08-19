"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { session } from "@/lib/auth/session";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session lives in localStorage/sessionStorage, which is unavailable during
  // SSR. Reading it here (post-hydration) avoids a server/client mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(session.getUser());
    setIsLoading(false);
  }, []);

  const setSession = useCallback(
    (
      nextUser: AuthUser,
      accessToken: string,
      refreshToken: string,
      rememberMe: boolean,
    ) => {
      session.save(nextUser, accessToken, refreshToken, rememberMe);
      setUser(nextUser);
    },
    [],
  );

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      setSession,
      logout,
    }),
    [user, isLoading, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
