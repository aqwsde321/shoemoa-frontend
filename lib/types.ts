// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  color: string;
  size: string[];
  image: string;
  description?: string;
  createdAt?: string;
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

// Search/Filter Types
export interface ProductFilters {
  keyword?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "name";
}
