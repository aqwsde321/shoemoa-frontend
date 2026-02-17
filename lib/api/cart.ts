import { API_ENDPOINTS } from "./config";
import type { ApiResponse, CartItem } from "../types";
import { mockCartItems, mockProducts } from "../mock-data";

/**
 * 장바구니 목록 조회
 */
export async function getCart(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>
): Promise<ApiResponse<CartItem[]>> {
  // TODO: 실제 API 연동 시 주석 해제
  // return authenticatedFetch<CartItem[]>(API_ENDPOINTS.CART);
  return { data: mockCartItems, success: true };
}

/**
 * 장바구니 아이템 추가
 */
export async function addToCart(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productId: number,
  quantity: number,
  selectedSize: string,
  selectedColor: string
): Promise<ApiResponse<CartItem>> {
  const product = mockProducts.find((p) => p.id === productId);
  const newItem: CartItem = {
    id: Date.now(),
    productId,
    product: product!,
    quantity,
    selectedSize,
    selectedColor,
  };
  return { data: newItem, success: true, message: "장바구니에 추가되었습니다" };
  // return authenticatedFetch<CartItem>(API_ENDPOINTS.CART, {
  //   method: "POST",
  //   body: JSON.stringify({ productId, quantity, selectedSize, selectedColor }),
  // });
}

/**
 * 장바구니 아이템 수량 수정
 */
export async function updateCartItem(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  cartItemId: number,
  quantity: number
): Promise<ApiResponse<CartItem>> {
  const item = mockCartItems.find((i) => i.id === cartItemId);
  return { data: { ...item!, quantity }, success: true };
  // return authenticatedFetch<CartItem>(`${API_ENDPOINTS.CART}/${cartItemId}`, {
  //   method: "PUT",
  //   body: JSON.stringify({ quantity }),
  // });
}

/**
 * 장바구니 아이템 삭제
 */
export async function removeFromCart(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  cartItemId: number
): Promise<ApiResponse<null>> {
  return { data: null, success: true, message: "장바구니에서 삭제되었습니다" };
  // return authenticatedFetch<null>(`${API_ENDPOINTS.CART}/${cartItemId}`, {
  //   method: "DELETE",
  // });
}
