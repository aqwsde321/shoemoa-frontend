// API Base URL - 나중에 실제 백엔드 주소로 변경
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/members/login",
  SIGNUP: "/api/members/signup",

  // Products (User)
  PRODUCTS: "/api/products",

  // Cart
  CART: "/api/cart",

  // Orders
  ORDERS: "/api/orders",

  // Admin Products
  ADMIN_PRODUCTS: "/api/admin/products",
} as const;
