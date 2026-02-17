"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getProducts } from "@/lib/api";
import type { Product, ProductFilters, ProductApiResponse } from "@/lib/types"; // Import ProductApiResponse
import { useDebounce } from "@/lib/hooks/use-debounce";
import { AVAILABLE_SIZES, AVAILABLE_COLORS } from "@/lib/mock-data";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalElements, setTotalElements] = useState(0); // New state for total elements
  const [totalPages, setTotalPages] = useState(0); // New state for total pages
  const [currentPage, setCurrentPage] = useState(0); // New state for current page
  const [filters, setFilters] = useState<ProductFilters>({
    name: "", // Changed from keyword to name to match API
    productSize: undefined, // New filter
    color: "",
    minPrice: undefined,
    maxPrice: undefined,
    sortType: "LATEST", // Changed from sortBy to sortType and default value
    page: 0, // Default page
    size: 10, // Default size
  });
  const debouncedName = useDebounce(filters.name, 500); // Debounce 'name' filter

  const fetchProducts = async (currentFilters: ProductFilters) => {
    setIsLoading(true);
    try {
      const response = await getProducts(currentFilters);
      if (response.success && response.data) {
        setProducts(response.data.content);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.number);
      }
    } catch (error) {
      console.error("[v0] Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only pass relevant filters to the API, including debounced name and pagination
    const apiFilters: ProductFilters = {
      name: debouncedName, // Use debouncedName for API
      productSize: filters.productSize,
      color: filters.color,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortType: filters.sortType,
      page: filters.page,
      size: filters.size,
    };
    fetchProducts(apiFilters);
  }, [debouncedName, filters.productSize, filters.color, filters.minPrice, filters.maxPrice, filters.sortType, filters.page, filters.size]);


  const handleFilterChange = (key: keyof ProductFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 })); // Reset page to 0 on filter change
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      productSize: undefined,
      color: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortType: "LATEST",
      page: 0,
      size: 10,
    });
  };

  const hasActiveFilters = filters.name || filters.productSize || filters.color || filters.minPrice || filters.maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Size Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          사이즈
        </Label>
        <Select
          value={filters.productSize?.toString() || "all"} // Use productSize
          onValueChange={(v) => handleFilterChange("productSize", v === "all" ? undefined : Number(v))} // Update productSize
        >
          <SelectTrigger className="h-11 bg-secondary border-0">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {AVAILABLE_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}> // Convert to string
                {size}mm
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          색상
        </Label>
        <Select
          value={filters.color || "all"}
          onValueChange={(v) => handleFilterChange("color", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-11 bg-secondary border-0">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {AVAILABLE_COLORS.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          가격 범위
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="최소"
            value={filters.minPrice || ""}
            onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            className="h-11 bg-secondary border-0"
          />
          <span className="text-muted-foreground">~</span>
          <Input
            type="number"
            placeholder="최대"
            value={filters.maxPrice || ""}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            className="h-11 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={clearFilters}
        >
          필터 초기화
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">전체 상품</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalElements}개의 상품
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="상품명으로 검색"
              value={filters.name} // Use filters.name
              onChange={(e) => handleFilterChange("name", e.target.value)} // Update filters.name
              className="h-11 pl-10 bg-secondary border-0"
            />
            {filters.name && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                onClick={() => handleFilterChange("name", "")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">검색어 지우기</span>
              </Button>
            )}
          </div>

          {/* Sort */}
          <Select
            value={filters.sortType} // Use filters.sortType
            onValueChange={(v) => handleFilterChange("sortType", v as ProductFilters["sortType"])} // Update sortType
          >
            <SelectTrigger className="w-full sm:w-40 h-11 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LATEST">최신순</SelectItem>
              <SelectItem value="PRICE_ASC">가격 낮은순</SelectItem>
              <SelectItem value="PRICE_DESC">가격 높은순</SelectItem>
              <SelectItem value="NAME_ASC">이름순</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden h-11 gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                필터
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader>
                <SheetTitle>필터</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden sm:block w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold mb-6">필터</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square bg-secondary rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-secondary rounded animate-pulse" />
                      <div className="h-3 bg-secondary rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
