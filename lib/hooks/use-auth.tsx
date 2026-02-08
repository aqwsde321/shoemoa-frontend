"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getUserRole,
  setUserRole,
  removeUserRole,
} from "@/lib/auth-storage";
import { login as apiLogin, reissueToken, fetchApi } from "@/lib/api"; // Added reissueToken and fetchApi
import { LoginRequest, ApiResponse } from "@/lib/types";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (credentials: LoginRequest) => Promise<string | null>;
  logout: () => void;
  isLoading: boolean;
  setAuthTokens: (accessToken: string, role: string) => void;
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRoleState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuthTokens = useCallback((accessToken: string, role: string) => {
    setAccessToken(accessToken);
    setUserRole(role);
    setIsAuthenticated(true);
    setUserRoleState(role);
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    const role = getUserRole();

    if (token && role) {
      setIsAuthenticated(true);
      setUserRoleState(role);
    } else {
      setIsAuthenticated(false);
      setUserRoleState(null);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<string | null> => {
      setIsLoading(true);
      try {
        const response = await apiLogin(credentials);
        if (response.success) {
          setAuthTokens(response.data.accessToken, response.data.role);
          return response.data.role;
        } else {
          console.error("Login failed:", response.message);
          return null;
        }
      } catch (error) {
        console.error("Login API call failed:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuthTokens]
  );

  const logout = useCallback(() => {
    setIsLoading(true);
    removeAccessToken();
    removeUserRole();
    setIsAuthenticated(false);
    setUserRoleState(null);
    router.push("/login");
    setIsLoading(false);
  }, [router]);

  const authenticatedFetch = useCallback(async <T>(
    endpoint: string,
    options?: RequestInit,
    retryCount = 0
  ): Promise<ApiResponse<T>> => {
    try {
      return await fetchApi<T>(endpoint, options);
    } catch (error: any) {
      if (error.status === 401 && error.code === "TOKEN_EXPIRED" && retryCount === 0) {
        try {
          const reissueResponse = await reissueToken();
          if (reissueResponse.success) {
            setAuthTokens(reissueResponse.data.accessToken, userRole || "USER");
            return await authenticatedFetch<T>(endpoint, options, retryCount + 1);
          } else {
            logout();
            throw new Error("Failed to re-issue token. Please log in again.");
          }
        } catch (reissueError) {
          console.error("Token re-issue failed:", reissueError);
          logout();
          throw new Error("Token re-issue failed. Please log in again.");
        }
      }
      throw error;
    }
  }, [logout, setAuthTokens, userRole]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, isLoading, setAuthTokens, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
