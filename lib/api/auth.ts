import { API_ENDPOINTS } from "./config";
import { fetchApi } from "./client";
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  SignupRequest, 
  TokenResponse 
} from "../types";

/**
 * 로그인 요청
 */
export async function login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return fetchApi<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify(loginData),
  });
}

/**
 * 회원가입 요청
 */
export async function signup(signupData: SignupRequest): Promise<ApiResponse<{[key: string]: string}>> {
  return fetchApi<{[key: string]: string}>(API_ENDPOINTS.SIGNUP, {
    method: "POST",
    body: JSON.stringify(signupData),
  });
}

/**
 * 토큰 재발급 (Silent Refresh)
 */
export async function reissueToken(): Promise<ApiResponse<TokenResponse>> {
  return fetchApi<TokenResponse>(API_ENDPOINTS.REISSUE, {
    method: "POST",
  });
}

/**
 * 이메일 인증 확인
 */
export async function verifyEmail(email: string, token: string): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>(`${API_ENDPOINTS.VERIFY_EMAIL}?email=${email}&token=${token}`, {
    method: "GET",
  });
}
