"use client";

import React from "react"

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X, PlusCircle } from "lucide-react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProductById, createProductWithImages, updateProductDetail } from "@/lib/api";
import type { ProductDetail, ProductOptionDetail, ProductImage } from "@/lib/types";
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
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    color: "",
    price: 0,
  });
  const [productOptions, setProductOptions] = useState<ProductOptionDetail[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [selectedFilesToUpload, setSelectedFilesToUpload] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // For new image previews
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for new image file input

  // Cleanup object URLs when component unmounts or selectedFilesToUpload changes
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setSelectedFilesToUpload(files);

      // Generate previews for newly selected files
      const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    } else {
      setSelectedFilesToUpload(null);
      setImagePreviews([]);
    }
  };


  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const response = await getProductById(Number(id));
          if (response.success && response.data) {
            const { options, images, ...rest } = response.data;
            setFormData(rest);
            setProductOptions(options);
            setProductImages(images);
          }
        } catch (error: any) {
          console.error("[v0] Failed to fetch product:", error);
          setError(`상품 정보를 불러오는데 실패했습니다: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    } else {
      setFormData({
        name: "",
        brand: "",
        description: "",
        color: "",
        price: 0,
      });
      setProductOptions([]);
      setProductImages([]);
      setSelectedFilesToUpload(null);
      setImagePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [id, isNew]);

  const handleAddOption = () => {
    setProductOptions([...productOptions, { size: Number(AVAILABLE_SIZES[0]), stock: 0 }]);
  };

  const handleOptionChange = (index: number, key: keyof ProductOptionDetail, value: string | number) => {
    const updatedOptions = [...productOptions];
    // Ensure size and stock are numbers
    if (key === "stock" || key === "size") {
      updatedOptions[index] = { ...updatedOptions[index], [key]: Number(value) };
    } else {
      updatedOptions[index] = { ...updatedOptions[index], [key]: value };
    }
    setProductOptions(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = productOptions.filter((_, i) => i !== index);
    setProductOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.brand || !formData.price || !formData.color || productOptions.length === 0) {
      setError("필수 항목 (상품명, 브랜드, 가격, 색상, 최소 한 개 이상의 사이즈/재고)을 모두 입력해주세요.");
      return;
    }
    if (productOptions.some(option => !option.size || option.stock < 0)) {
      setError("모든 사이즈 옵션의 크기와 재고를 올바르게 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        const result = await createProductWithImages(formData, selectedFilesToUpload);
        if (result.success) {
          alert("상품이 성공적으로 등록되었습니다.");
          router.push("/admin");
        } else {
          setError(result.message || "상품 등록에 실패했습니다.");
        }
      } else {
        // For existing products, `productImages` state holds existing images.
        // `selectedFilesToUpload` holds new files to be added.
        // For simplicity, we assume new files are appended. If existing images need to be deleted,
        // a more complex UI and backend API would be required (e.g., passing image IDs to delete).
        const productDetailForUpdate = {
          ...formData,
          options: productOptions,
        };
        const result = await updateProductDetail(Number(id), productDetailForUpdate, selectedFilesToUpload);
        if (result.success) {
          alert("상품이 성공적으로 수정되었습니다.");
          router.push("/admin");
        } else {
          setError(result.message || "상품 수정에 실패했습니다.");
        }
      }
    } catch (err: any) {
      console.error("[v0] Failed to save product:", err);
      setError(`저장에 실패했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
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

          {/* Product Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              브랜드 *
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="브랜드를 입력하세요"
              className="h-12 bg-secondary border-0"
              required
            />
          </div>

          {/* Product Price */}
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

          {/* Product Options (Size and Stock) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                사이즈 및 재고 *
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <PlusCircle className="h-4 w-4 mr-2" />
                옵션 추가
              </Button>
            </div>
            {productOptions.length === 0 && (
              <p className="text-sm text-muted-foreground">최소 한 개 이상의 사이즈 옵션을 추가해주세요.</p>
            )}
            {productOptions.map((option, index) => (
              <div key={index} className="flex items-end gap-2 bg-secondary p-3 rounded-md">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`size-${index}`} className="sr-only">사이즈</Label>
                  <select
                    id={`size-${index}`}
                    value={option.size}
                    onChange={(e) => handleOptionChange(index, "size", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {AVAILABLE_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`stock-${index}`} className="sr-only">재고</Label>
                  <Input
                    id={`stock-${index}`}
                    type="number"
                    value={option.stock}
                    onChange={(e) => handleOptionChange(index, "stock", e.target.value)}
                    placeholder="재고"
                    min={0}
                    className="h-10 bg-background border-0"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                  <X className="h-4 w-4 text-destructive" />
                  <span className="sr-only">옵션 제거</span>
                </Button>
              </div>
            ))}
          </div>

          {/* Product Images */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              상품 이미지
            </Label>
            {/* Display existing images */}
            {productImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {productImages.map((img) => (
                  <div key={img.id} className="relative w-full h-24 rounded-md overflow-hidden border border-gray-200">
                    <img src={img.imageUrl} alt="기존 이미지" className="w-full h-full object-cover" />
                    {/* Optionally add delete button for existing images */}
                  </div>
                ))}
              </div>
            )}
            {/* Input for new images */}
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              ref={fileInputRef}
              className="h-10 bg-secondary border-0"
            />
            {/* Display previews for newly selected images */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative w-full h-24 rounded-md overflow-hidden border border-gray-200">
                    <img src={previewUrl} alt={`새 이미지 미리보기 ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
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
