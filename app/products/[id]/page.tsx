"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getProductById, addToCart } from "@/lib/api";
import type { ProductDetail } from "@/lib/types";
import useEmblaCarousel from 'embla-carousel-react'

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (emblaApi) emblaApi.on('select', onSelect);
    return () => {
      if (emblaApi) emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await getProductById(Number(id));

        if (response.success && response.data) {
          setProduct(response.data);
          if (response.data.options && response.data.options.length > 0) { // Check if options exist
            setSelectedSize(String(response.data.options[0].size));
          }
        } else {
          // If API call was successful but no data or success is false
          console.error("ProductDetailPage: API returned no product or success was false.");
        }
      } catch (error) {
        console.error("ProductDetailPage: Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) { // Ensure id is available before fetching
      fetchProduct();
    }
  }, [id]); // Dependency array includes 'id'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedSize, product.color);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("[v0] Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedSize) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity, selectedSize, product.color);
      router.push("/cart");
    } catch (error) {
      console.error("[v0] Failed to add to cart:", error);
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-secondary rounded w-24 mb-8" />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
              <div className="aspect-square bg-secondary rounded-lg" />
              <div className="space-y-6">
                <div className="h-8 bg-secondary rounded w-3/4" />
                <div className="h-6 bg-secondary rounded w-1/4" />
                <div className="h-4 bg-secondary rounded w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">상품을 찾을 수 없습니다</h1>
            <Button asChild>
              <Link href="/products">상품 목록으로</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const selectedOption = product.options.find(
    (option) => String(option.size) === selectedSize
  );
  const currentStock = selectedOption ? selectedOption.stock : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>상품 목록</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg bg-secondary" ref={emblaRef}>
              <div className="flex">
                {product.images
                  .slice() // Create a shallow copy to avoid modifying the original array
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((img, index) => (
                    <div className="relative flex-none w-full aspect-square" key={img.imageUrl || index}>
                      <Image
                        src={img.imageUrl || "/placeholder.svg"}
                        alt={product.name + " " + (index + 1)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes, adjust as needed
                        style={{ objectFit: "cover" }}
                        priority={index === 0} // Prioritize loading the first image
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-background/50 hover:bg-background/70 rounded-full z-10"
                  onClick={() => emblaApi && emblaApi.scrollPrev()}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">이전 이미지</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-background/50 hover:bg-background/70 rounded-full z-10"
                  onClick={() => emblaApi && emblaApi.scrollNext()}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">다음 이미지</span>
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        index === selectedIndex ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      onClick={() => emblaApi && emblaApi.scrollTo(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Title & Price */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">{product.color}</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold mt-4">
                  {formatPrice(product.price)}원
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  사이즈
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.options.map((option) => (
                    <button
                      key={option.size}
                      type="button"
                      onClick={() => setSelectedSize(String(option.size))}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedSize === String(option.size)
                          ? "bg-foreground text-background"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {option.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  수량
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">수량 감소</span>
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">수량 증가</span>
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    재고 {currentStock}개
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-8 mt-8 border-t border-border">
              <Button
                className="w-full h-12 gap-2"
                onClick={handleAddToCart}
                disabled={isAddingToCart || currentStock === 0}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    장바구니에 추가됨
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    장바구니 담기
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 bg-transparent"
                onClick={handleBuyNow}
                disabled={isAddingToCart || currentStock === 0}
              >
                바로 구매
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
