"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProductWithImages } from "@/lib/api";
import { useAuth } from "@/lib/hooks/use-auth";

export default function NewProductPage() {
  const { authenticatedFetch } = useAuth();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setImages(files);

      // Generate previews
      const newPreviews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    } else {
      setImages(null);
      setImagePreviews([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name,
      brand,
      description,
      color,
      price,
      options: [],
    };

    // Use the new API function
    try {
      const result = await createProductWithImages(authenticatedFetch, productData, images);

      if (result.success) {
        alert("상품이 성공적으로 등록되었습니다.");
        // Optionally, redirect to product list or clear form
        setName("");
        setBrand("");
        setDescription("");
        setColor("");
        setPrice(0);
        setImages(null);
        setImagePreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input visually
        }
      } else {
        alert("상품 등록에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      alert(`상품 등록 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">새 상품 등록</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-base font-medium">상품명</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="brand" className="text-base font-medium">브랜드</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-base font-medium">설명</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="min-h-[120px]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color" className="text-base font-medium">색상</Label>
            <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price" className="text-base font-medium">가격</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="images" className="text-base font-medium">상품 이미지</Label>
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              ref={fileInputRef}
            />
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                    <img src={previewUrl} alt={`Product preview ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full py-2 text-lg font-semibold">상품 등록</Button>
        </form>
      </div>
    </div>
  );
}
