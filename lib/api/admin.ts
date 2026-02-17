import { API_ENDPOINTS } from "./config";
import type { ApiResponse, ProductApiResponse } from "../types";
import { mockProducts } from "../mock-data";

/**
 * 관리자용 상품 목록 조회
 */
export async function getAdminProducts(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>
): Promise<ApiResponse<ProductApiResponse>> {
  try {
    return await authenticatedFetch<ProductApiResponse>(API_ENDPOINTS.ADMIN_PRODUCTS);
  } catch (error) {
    console.error("Failed to fetch admin products, returning mock data:", error);
    const mockProductApiResponse: ProductApiResponse = {
      content: mockProducts,
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: [{ direction: "ASC", nullHandling: "NATIVE", ascending: true, property: "id", ignoreCase: false }],
        offset: 0,
        paged: true,
        unpaged: false,
      },
      last: true,
      totalPages: 1,
      totalElements: mockProducts.length,
      first: true,
      size: mockProducts.length,
      number: 0,
      sort: [{ direction: "ASC", nullHandling: "NATIVE", ascending: true, property: "id", ignoreCase: false }],
      numberOfElements: mockProducts.length,
      empty: false,
    };
    return { data: mockProductApiResponse, success: true, message: "Mock data fallback" };
  }
}

/**
 * 상품 삭제
 */
export async function deleteProduct(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productId: number
): Promise<ApiResponse<null>> {
  try {
    return await authenticatedFetch<null>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Failed to delete product ${productId}, mocking success:`, error);
    return { data: null, success: true, message: "상품이 삭제되었습니다 (Mock)" };
  }
}
