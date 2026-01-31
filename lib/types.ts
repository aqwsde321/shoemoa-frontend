
export interface ProductOption {
  size: number;
  stock: number;
}
// Product Types
export interface Product {
  id: number;
  name:string;
  brand: string;
  description?: string;
  color: string;
  price: number;
  img: string;
  options: ProductOption[];
}

// Cart Types
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

// Order Types
export interface Order {
  id: number;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}

// Auth Types
export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination metadata from the backend API response
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

// Product API Response Type that includes pagination and product content
export interface ProductApiResponse {
  content: Product[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}


// Search/Filter Types
export interface ProductFilters {
  keyword?: string; // Changed from 'name' to 'keyword' as per curl example
  name?: string; // Add name filter based on curl example
  productSize?: number; // Add productSize filter based on curl example
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sortType?: "LATEST" | "PRICE_ASC" | "PRICE_DESC" | "NAME_ASC"; // Changed from 'sortBy' and updated values based on curl example and typical backend enums
  page?: number; // Added for pagination
  size?: number; // Added for pagination
}