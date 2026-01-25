"use client";

import React from "react"

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProductById, createProduct, updateProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import { AVAILABLE_SIZES, AVAILABLE_COLORS } from "@/lib/mock-data";

export default function AdminProductFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    stock: 0,
    color: "",
    size: [],
    image: "",
    description: "",
  });

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const response = await getProductById(Number(id));
          if (response.success && response.data) {
            const { id: _, ...rest } = response.data;
            setFormData(rest);
          }
        } catch (error) {
          console.error("[v0] Failed to fetch product:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.color || formData.size.length === 0) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        await createProduct(formData);
      } else {
        await updateProduct(Number(id), formData);
      }
      router.push("/admin");
    } catch (error) {
      console.error("[v0] Failed to save product:", error);
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-secondary rounded w-24" />
            <div className="h-8 bg-secondary rounded w-48" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-secondary rounded" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>상품 목록</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-8">
          {isNew ? "상품 등록" : "상품 수정"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              상품명 *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="상품명을 입력하세요"
              className="h-12 bg-secondary border-0"
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                가격 (원) *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
                className="h-12 bg-secondary border-0"
                required
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                재고 *
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || ""}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
                className="h-12 bg-secondary border-0"
                required
                min={0}
              />
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              색상 *
            </Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    formData.color === color
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              사이즈 * (복수 선택 가능)
            </Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    formData.size.includes(size)
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {formData.size.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">선택된 사이즈:</span>
                <div className="flex flex-wrap gap-1">
                  {formData.size.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-foreground/10 rounded"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => toggleSize(size)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              이미지 URL
            </Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="h-12 bg-secondary border-0"
            />
            {formData.image && (
              <div className="mt-2 w-32 h-32 overflow-hidden rounded-lg bg-secondary">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="미리보기"
                  className="h-full w-full object-cover object-center"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              상품 설명
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="상품에 대한 설명을 입력하세요"
              className="min-h-[120px] bg-secondary border-0 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 bg-transparent"
              onClick={() => router.push("/admin")}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
