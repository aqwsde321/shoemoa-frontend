// lib/auth-storage.ts

let _accessToken: string | null = null;
let _userRole: string | null = null;

export const setAccessToken = (token: string) => {
  _accessToken = token;
};

export const getAccessToken = (): string | null => {
  return _accessToken;
};

export const removeAccessToken = () => {
  _accessToken = null;
  removeUserRole();
};

export const setUserRole = (role: string) => {
  _userRole = role;
};

export const getUserRole = (): string | null => {
  return _userRole;
};

export const removeUserRole = () => {
  _userRole = null;
};

/**
 * NOTE: Access tokens and user roles are stored in-memory for security reasons,
 * reducing exposure to XSS attacks. Refresh tokens are handled
 * via HTTP-only cookies by the backend and are not directly managed here.
 */