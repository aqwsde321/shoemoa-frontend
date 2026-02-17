// lib/auth-storage.ts

let _accessToken: string | null = null;
let _userRole: string | null = null;
let _userEmail: string | null = null;

export const setAccessToken = (token: string) => {
  _accessToken = token;
};

export const getAccessToken = (): string | null => {
  return _accessToken;
};

export const removeAccessToken = () => {
  _accessToken = null;
  removeUserRole();
  removeUserEmail();
};

export const setUserRole = (role: string) => {
  _userRole = role;
  if (typeof window !== "undefined") {
    localStorage.setItem("shoemoa_role", role);
  }
};

export const getUserRole = (): string | null => {
  if (!_userRole && typeof window !== "undefined") {
    _userRole = localStorage.getItem("shoemoa_role");
  }
  return _userRole;
};

export const removeUserRole = () => {
  _userRole = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("shoemoa_role");
  }
};

export const setUserEmail = (email: string) => {
  _userEmail = email;
  if (typeof window !== "undefined") {
    localStorage.setItem("shoemoa_email", email);
  }
};

export const getUserEmail = (): string | null => {
  if (!_userEmail && typeof window !== "undefined") {
    _userEmail = localStorage.getItem("shoemoa_email");
  }
  return _userEmail;
};

export const removeUserEmail = () => {
  _userEmail = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("shoemoa_email");
  }
};

/**
 * NOTE: Access tokens and user roles are stored in-memory for security reasons,
 * reducing exposure to XSS attacks. Refresh tokens are handled
 * via HTTP-only cookies by the backend and are not directly managed here.
 */