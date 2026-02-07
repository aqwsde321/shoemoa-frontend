// lib/auth-storage.ts

const ACCESS_TOKEN_KEY = "accessToken";

export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * NOTE: Using localStorage for token storage is convenient for development
 * but has security implications (e.g., XSS attacks).
 * For production applications, consider more secure methods like:
 * - HTTP-only cookies (for CSRF protection and not accessible via JS)
 * - Web Workers (to isolate token logic)
 * - Server-side sessions (if not fully stateless)
 */
