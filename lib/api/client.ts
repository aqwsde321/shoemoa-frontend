import { API_BASE_URL } from "./config";
import type { ApiResponse } from "../types";
import { getAccessToken } from "../auth-storage";

// Map to track in-flight requests for deduplication
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * 전역 공통 API 호출 함수
 * - 중복 요청 제거(Deduplication) 로직 포함
 * - 인증 토큰 자동 주입
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  // Create a unique key for the request based on method, endpoint, and body
  const method = options?.method || "GET";
  const body = options?.body ? (options.body instanceof FormData ? "form-data" : JSON.stringify(options.body)) : "";
  const requestKey = `${method}:${endpoint}:${body}`;

  // If the same request is already in progress, return the existing promise
  if (inFlightRequests.has(requestKey)) {
    console.log(`[Deduplication] Sharing in-flight request: ${requestKey}`);
    return inFlightRequests.get(requestKey);
  }

  const fetchPromise = (async () => {
    const headers: Record<string, string> = {
      ...Object.fromEntries(Object.entries(options?.headers || {})),
    };

    const accessToken = getAccessToken();
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: headers,
        credentials: "include", // 쿠키 전송 및 수신을 위해 필요 (Refresh Token 대비)
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
        const errorCode = errorData?.code;

        const error = new Error(errorMessage) as any;
        error.status = response.status;
        error.code = errorCode;
        throw error;
      }

      const data = await response.json();
      return { data: data as T, success: true };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      // Remove from map once finished
      inFlightRequests.delete(requestKey);
    }
  })();

  // Store the promise in the map
  inFlightRequests.set(requestKey, fetchPromise);

  return fetchPromise;
}
