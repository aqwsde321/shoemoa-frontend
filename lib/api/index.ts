import { API_BASE_URL, API_ENDPOINTS } from "./config";
import type { Product, CartItem, Order, AuthResponse, ProductFilters, ApiResponse, ProductApiResponse } from "../types";
import { mockProducts, mockCartItems } from "../mock-data";

// Helper function for API calls
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ==================== Auth API ====================
export async function login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  // Mock implementation
  console.log("[v0] Login attempt:", email);
  return {
    data: {
      user: { id: 1, email, name: "사용자" },
      token: "mock-jwt-token",
    },
    success: true,
    message: "로그인 성공",
  };
  // Real API call (uncomment when backend is ready):
  // return fetchApi<AuthResponse>(API_ENDPOINTS.LOGIN, {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // });
}

export async function signup(email: string, password: string, name?: string): Promise<ApiResponse<AuthResponse>> {
  // Mock implementation
  console.log("[v0] Signup attempt:", email);
  return {
    data: {
      user: { id: 1, email, name: name || "새 사용자" },
      token: "mock-jwt-token",
    },
    success: true,
    message: "회원가입 성공",
  };
  // Real API call:
  // return fetchApi<AuthResponse>(API_ENDPOINTS.SIGNUP, {
  //   method: "POST",
  //   body: JSON.stringify({ email, password, name }),
  // });
}

// ==================== Products API ====================
export async function getProducts(filters?: ProductFilters): Promise<ApiResponse<ProductApiResponse>> {
  const params = new URLSearchParams();

  // Map filters to API query parameters
  if (filters?.name) { // Use filters.name for API query
    params.append("name", filters.name);
  }
  if (filters?.productSize) {
    params.append("productSize", String(filters.productSize));
  }
  if (filters?.color) {
    params.append("color", filters.color);
  }
  if (filters?.minPrice) {
    params.append("minPrice", String(filters.minPrice));
  }
  if (filters?.maxPrice) {
    params.append("maxPrice", String(filters.maxPrice));
  }
  if (filters?.sortType) {
    params.append("sortType", filters.sortType);
  }
  params.append("page", String(filters?.page ?? 0)); // Default to 0
  params.append("size", String(filters?.size ?? 10)); // Default to 10

  return fetchApi<ProductApiResponse>(`${API_ENDPOINTS.PRODUCTS}?${params.toString()}`);
}

export async function getProductById(id: number): Promise<ApiResponse<Product | null>> {
  const product = mockProducts.find((p) => p.id === id) || null;
  return { data: product, success: true };
  // Real API call:
  // return fetchApi<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
}

// ==================== Cart API ====================
export async function getCart(): Promise<ApiResponse<CartItem[]>> {
  return { data: mockCartItems, success: true };
  // Real API call:
  // return fetchApi<CartItem[]>(API_ENDPOINTS.CART);
}

export async function addToCart(
  productId: number,
  quantity: number,
  selectedSize: string,
  selectedColor: string
): Promise<ApiResponse<CartItem>> {
  console.log("[v0] Add to cart:", { productId, quantity, selectedSize, selectedColor });
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
  // Real API call:
  // return fetchApi<CartItem>(API_ENDPOINTS.CART, {
  //   method: "POST",
  //   body: JSON.stringify({ productId, quantity, selectedSize, selectedColor }),
  // });
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number
): Promise<ApiResponse<CartItem>> {
  console.log("[v0] Update cart item:", { cartItemId, quantity });
  const item = mockCartItems.find((i) => i.id === cartItemId);
  return { data: { ...item!, quantity }, success: true };
  // Real API call:
  // return fetchApi<CartItem>(`${API_ENDPOINTS.CART}/${cartItemId}`, {
  //   method: "PUT",
  //   body: JSON.stringify({ quantity }),
  // });
}

export async function removeFromCart(cartItemId: number): Promise<ApiResponse<null>> {
  console.log("[v0] Remove from cart:", cartItemId);
  return { data: null, success: true, message: "장바구니에서 삭제되었습니다" };
  // Real API call:
  // return fetchApi<null>(`${API_ENDPOINTS.CART}/${cartItemId}`, {
  //   method: "DELETE",
  // });
}

// ==================== Orders API ====================
export async function createOrder(cartItemIds: number[]): Promise<ApiResponse<Order>> {
  console.log("[v0] Create order:", cartItemIds);
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
  // Real API call:
  // return fetchApi<Order>(API_ENDPOINTS.ORDERS, {
  //   method: "POST",
  //   body: JSON.stringify({ cartItemIds }),
  // });
}

// ==================== Admin Products API ====================
export async function getAdminProducts(): Promise<ApiResponse<Product[]>> {
  return { data: mockProducts, success: true };
  // Real API call:
  // return fetchApi<Product[]>(API_ENDPOINTS.ADMIN_PRODUCTS);
}

export async function createProduct(product: Omit<Product, "id">): Promise<ApiResponse<Product>> {
  console.log("[v0] Create product:", product);
  const newProduct: Product = {
    ...product,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  return { data: newProduct, success: true, message: "상품이 등록되었습니다" };
  // Real API call:
  // return fetchApi<Product>(API_ENDPOINTS.ADMIN_PRODUCTS, {
  //   method: "POST",
  //   body: JSON.stringify(product),
  // });
}

export async function updateProduct(
  productId: number,
  product: Partial<Product>
): Promise<ApiResponse<Product>> {
  console.log("[v0] Update product:", { productId, product });
  const existing = mockProducts.find((p) => p.id === productId);
  return { data: { ...existing!, ...product }, success: true, message: "상품이 수정되었습니다" };
  // Real API call:
  // return fetchApi<Product>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}`, {
  //   method: "PUT",
  //   body: JSON.stringify(product),
  // });
}

export async function deleteProduct(productId: number): Promise<ApiResponse<null>> {
  console.log("[v0] Delete product:", productId);
  return { data: null, success: true, message: "상품이 삭제되었습니다" };
  // Real API call:
  // return fetchApi<null>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}`, {
  //   method: "DELETE",
  // });
}

