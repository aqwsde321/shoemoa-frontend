// OpenAPI Spec-based types

// ==================== API Response Wrappers ====================

/**
 * Generic API response wrapper used by the fetchApi helper.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Pagination and sorting details from the backend.
 * Based on Spring Pageable object.
 */
export interface PageableObject {
  offset: number;
  sort: SortObject[];
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

/**
 * Sorting details for a specific field.
 */
export interface SortObject {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}


// ==================== Product Types ====================

/**
 * Represents a product in a search result list.
 * Based on Spec: ProductSearchResult
 */
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  color: string;
  price: number;
  thumbnailUrl: string;
  createdAt: string; // Assuming format is "YYYY-MM-DDTHH:mm:ss"
}

/**
 * Detailed information for a single product.
 * Based on Spec: ProductDetailDto
 */
export interface ProductDetail {
  name: string;
  brand: string;
  color: string;
  price: number;
  options: ProductOptionDetail[];
  images: ProductImage[];
}

/**
 * Image details for a product.
 * Based on Spec: ProductImageDto
 */
export interface ProductImage {
  imageUrl: string;
  sortOrder: number;
  thumbnail: boolean;
}

/**
 * Size and stock information for a product option.
 * Based on Spec: ProductOptionDetailDto
 */
export interface ProductOptionDetail {
  size: number;
  stock: number;
}

/**
 * The structure of the API response for a product search query.
 * Based on Spec: PageProductSearchResult
 */
export interface ProductApiResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Product[];
  number: number;
  sort: SortObject[];
  pageable: PageableObject;
  numberOfElements: number;
  empty: boolean;
}

/**
 * Filters for searching products.
 * Based on Spec: ProductSearchCond & Pageable
 */
export interface ProductFilters {
  name?: string;
  productSize?: number;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sortType?: "LATEST" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC";
  page?: number;
  size?: number;
}


// ==================== Auth Types ====================

/**
 * Request body for user login.
 * Based on Spec: LoginRequestDto
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Request body for user signup.
 * Based on Spec: SignupRequestDto
 */
export interface SignupRequest {
  email: string;
  password: string;
}

/**
 * API response for a successful login.
 * Based on Spec: LoginResponseDto
 */
export interface LoginResponse {
  accessToken: string;
  email: string;
  role: string;
}


// ==================== Cart & Order Types (Legacy, to be reviewed) ====================
// These types are based on the old mock data and may need updates
// once the cart/order APIs are defined in the spec.

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: number;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}