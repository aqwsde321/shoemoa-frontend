import { API_BASE_URL, API_ENDPOINTS } from "./config";
import type {
  Product,
  ProductDetail,
  CartItem,
  Order,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  ProductFilters,
  ApiResponse,
  ProductApiResponse,
  TokenResponse,
} from "../types";
import { mockProducts, mockCartItems } from "../mock-data";

import { getAccessToken } from "../auth-storage";

// Helper function for API calls
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
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
    return { data, success: true };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// ==================== Auth API ====================
export async function login(loginData: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return fetchApi<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify(loginData),
  });
}

export async function signup(signupData: SignupRequest): Promise<ApiResponse<{[key: string]: string}>> {
  return fetchApi<{[key: string]: string}>(API_ENDPOINTS.SIGNUP, {
    method: "POST",
    body: JSON.stringify(signupData),
  });
}

export async function reissueToken(): Promise<ApiResponse<TokenResponse>> {
  return fetchApi<TokenResponse>(API_ENDPOINTS.REISSUE, {
    method: "POST",
  });
}

export async function verifyEmail(email: string, token: string): Promise<ApiResponse<{ message: string }>> {
  return fetchApi<{ message: string }>(`${API_ENDPOINTS.VERIFY_EMAIL}?email=${email}&token=${token}`, {
    method: "GET",
  });
}

// ==================== Products API ====================
export async function createProductWithImages(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productData: {
    name: string;
    brand: string;
    description?: string;
    color: string;
    price: number;
  },
  images: FileList | null
): Promise<ApiResponse<{ productId: number }>> {
  const formData = new FormData();
  const productDataBlob = new Blob([JSON.stringify(productData)], { type: "application/json" });
  formData.append("data", productDataBlob);

  if (images) {
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
  }

  return authenticatedFetch<{ productId: number }>(API_ENDPOINTS.PRODUCTS, {
    method: "POST",
    body: formData,
  });
}

export async function updateProductDetail(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productId: number,
  productData: Omit<ProductDetail, "id" | "images" | "createdAt">,
  newImages: FileList | null
): Promise<ApiResponse<ProductDetail>> {
  const formData = new FormData();
  formData.append("data", JSON.stringify(productData));

  if (newImages) {
    for (let i = 0; i < newImages.length; i++) {
      formData.append("images", newImages[i]);
    }
  }

  return authenticatedFetch<ProductDetail>(`${API_ENDPOINTS.PRODUCTS}/${productId}`, {
    method: "PUT",
    body: formData,
  });
}

export async function getProducts(filters?: ProductFilters): Promise<ApiResponse<ProductApiResponse>> {
  const params = new URLSearchParams();

  if (filters?.name) params.append("name", filters.name);
  if (filters?.productSize) params.append("productSize", String(filters.productSize));
  if (filters?.color) params.append("color", filters.color);
  if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
  if (filters?.sortType) params.append("sortType", filters.sortType);
  params.append("page", String(filters?.page ?? 0));
  params.append("size", String(filters?.size ?? 10));

  try {
    // getProducts is a public API, so it uses fetchApi directly.
    return await fetchApi<ProductApiResponse>(`${API_ENDPOINTS.PRODUCTS}?${params.toString()}`);
  } catch (error) {
    console.error("Failed to fetch products from API, returning mock data:", error);
    // Fallback to mock data on error
    const mockProductApiResponse: ProductApiResponse = {
      content: mockProducts.slice(
        (filters?.page ?? 0) * (filters?.size ?? 10),
        ((filters?.page ?? 0) + 1) * (filters?.size ?? 10)
      ),
      pageable: {
        pageNumber: filters?.page ?? 0,
        pageSize: filters?.size ?? 10,
        sort: [{ direction: "ASC", nullHandling: "NATIVE", ascending: true, property: "id", ignoreCase: false }],
        offset: (filters?.page ?? 0) * (filters?.size ?? 10),
        paged: true,
        unpaged: false,
      },
      last: (filters?.page ?? 0) * (filters?.size ?? 10) + (filters?.size ?? 10) >= mockProducts.length,
      totalPages: Math.ceil(mockProducts.length / (filters?.size ?? 10)),
      totalElements: mockProducts.length,
      first: (filters?.page ?? 0) === 0,
      size: filters?.size ?? 10,
      number: filters?.page ?? 0,
      sort: [{ direction: "ASC", nullHandling: "NATIVE", ascending: true, property: "id", ignoreCase: false }],
      numberOfElements: mockProducts.length,
      empty: mockProducts.length === 0,
    };
    return { data: mockProductApiResponse, success: true, message: "Mock data fallback" };
  }
}

export async function getProductById(id: number): Promise<ApiResponse<ProductDetail | null>> {
  try {
    // getProductById is a public API, so it uses fetchApi directly.
    return await fetchApi<ProductDetail>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id} from API, returning mock data:`, error);
    // Fallback to mock data on error
    const mockProduct = mockProducts.find(p => p.id === id);
    if (!mockProduct) {
      return { data: null, success: false, message: "Mock product not found" };
    }
    const mockProductDetail: ProductDetail = {
      name: mockProduct.name,
      brand: mockProduct.brand,
      color: mockProduct.color,
      price: mockProduct.price,
      options: [{ size: 250, stock: 10 }, { size: 260, stock: 5 }, { size: 270, stock: 12 }],
      images: [{ imageUrl: mockProduct.thumbnailUrl, sortOrder: 1, thumbnail: true }],
    };
    return { data: mockProductDetail, success: true, message: "Mock data fallback" };
  }
}

// ==================== Cart API ====================
export async function getCart(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>
): Promise<ApiResponse<CartItem[]>> {
  return { data: mockCartItems, success: true };
  // return authenticatedFetch<CartItem[]>(API_ENDPOINTS.CART);
}

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

export async function removeFromCart(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  cartItemId: number
): Promise<ApiResponse<null>> {
  return { data: null, success: true, message: "장바구니에서 삭제되었습니다" };
  // return authenticatedFetch<null>(`${API_ENDPOINTS.CART}/${cartItemId}`, {
  //   method: "DELETE",
  // });
}

// ==================== Orders API ====================
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

// ==================== Admin Products API ====================
export async function getAdminProducts(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>
): Promise<ApiResponse<ProductApiResponse>> {
  // return authenticatedFetch<ProductApiResponse>(API_ENDPOINTS.ADMIN_PRODUCTS);
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
  return { data: mockProductApiResponse, success: true };
}

export async function deleteProduct(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productId: number
): Promise<ApiResponse<null>> {
  return { data: null, success: true, message: "상품이 삭제되었습니다" };
  // return authenticatedFetch<null>(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}`, {
  //   method: "DELETE",
  // });
}


