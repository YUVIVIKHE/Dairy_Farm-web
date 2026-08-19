import type { AuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "df_access_token";
const REFRESH_TOKEN_KEY = "df_refresh_token";
const USER_KEY = "df_user";
const SESSION_COOKIE = "df_session";
const ROLE_COOKIE = "df_role";

type Storage = "local" | "session";

function getStore(storage: Storage): globalThis.Storage {
  return storage === "local" ? window.localStorage : window.sessionStorage;
}

function setSessionCookie(role: AuthUser["role"], rememberMe: boolean) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 12;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

function clearAll() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  clearSessionCookie();
}

export const session = {
  save(
    user: AuthUser,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
  ) {
    if (typeof window === "undefined") return;
    clearAll();
    const storage = getStore(rememberMe ? "local" : "session");
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    storage.setItem(USER_KEY, JSON.stringify(user));
    setSessionCookie(user.role, rememberMe);
  },

  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw =
      window.localStorage.getItem(USER_KEY) ??
      window.sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      window.localStorage.getItem(ACCESS_TOKEN_KEY) ??
      window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      window.localStorage.getItem(REFRESH_TOKEN_KEY) ??
      window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },

  clear() {
    if (typeof window === "undefined") return;
    clearAll();
  },
};
