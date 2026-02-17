import { API_ENDPOINTS } from "./config";
import type { ApiResponse, Order } from "../types";
import { mockCartItems } from "../mock-data";

/**
 * 주문 생성
 */
export async function createOrder(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  cartItemIds: number[]
): Promise<ApiResponse<Order>> {
  const items = mockCartItems.filter((i) => cartItemIds.includes(i.id));
  const totalAmount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const order: Order = {
    id: Date.now(),
    items,
    totalAmount,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  return { data: order, success: true, message: "주문이 완료되었습니다" };
  // return authenticatedFetch<Order>(API_ENDPOINTS.ORDERS, {
  //   method: "POST",
  //   body: JSON.stringify({ cartItemIds }),
  // });
}
