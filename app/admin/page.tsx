"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAdminProducts, deleteProduct } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAdminProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("[v0] Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (error) {
      console.error("[v0] Failed to delete product:", error);
    } finally {
      setDeleteId(null);
    }
  };

  // Mobile Card View
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 overflow-hidden rounded-md bg-secondary shrink-0">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover object-center"
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.color}</p>
          <p className="font-semibold mt-1">{formatPrice(product.price)}원</p>
          <p className="text-xs text-muted-foreground mt-1">
            재고: {product.stock}개 | 사이즈: {product.size.join(", ")}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
          <Link href={`/admin/products/${product.id}`}>
            <Pencil className="h-3 w-3 mr-1" />
            수정
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive bg-transparent"
          onClick={() => setDeleteId(product.id)}
        >
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">삭제</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">상품 관리</h1>
            <p className="text-sm text-muted-foreground mt-1">
              총 {filteredProducts.length}개의 상품
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              상품 등록
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="상품명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-secondary border-0"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-secondary rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">등록된 상품이 없습니다</p>
            <Button asChild className="mt-4">
              <Link href="/admin/products/new">첫 상품 등록하기</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="w-[80px]">이미지</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>색상</TableHead>
                    <TableHead className="text-right">가격</TableHead>
                    <TableHead className="text-right">재고</TableHead>
                    <TableHead>사이즈</TableHead>
                    <TableHead className="w-[100px]">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 overflow-hidden rounded bg-secondary">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.color}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(product.price)}원
                      </TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {product.size.slice(0, 3).join(", ")}
                          {product.size.length > 3 && ` +${product.size.length - 3}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">수정</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">삭제</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 상품이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
