import { API_ENDPOINTS } from "./config";
import { fetchApi } from "./client";
import type { 
  ApiResponse, 
  ProductApiResponse, 
  ProductDetail, 
  ProductFilters, 
  ProductOptionDetail 
} from "../types";
import { mockProducts } from "../mock-data";

/**
 * 상품 등록 (이미지 포함)
 */
export async function createProductWithImages(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productData: {
    name: string;
    brand: string;
    description?: string;
    color: string;
    price: number;
    options: ProductOptionDetail[];
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

/**
 * 상품 정보 수정
 */
export async function updateProductDetail(
  authenticatedFetch: <T>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>,
  productId: number,
  productData: Omit<ProductDetail, "id" | "images" | "createdAt">,
  newImages: FileList | null
): Promise<ApiResponse<ProductDetail>> {
  const formData = new FormData();
  const productDataBlob = new Blob([JSON.stringify(productData)], { type: "application/json" });
  formData.append("data", productDataBlob);

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

/**
 * 상품 목록 조회 (필터링 및 페이징 적용)
 */
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
    return await fetchApi<ProductApiResponse>(`${API_ENDPOINTS.PRODUCTS}?${params.toString()}`);
  } catch (error) {
    console.error("Failed to fetch products from API, returning mock data:", error);
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

/**
 * 상품 상세 조회
 */
export async function getProductById(id: number): Promise<ApiResponse<ProductDetail | null>> {
  try {
    return await fetchApi<ProductDetail>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id} from API, returning mock data:`, error);
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
