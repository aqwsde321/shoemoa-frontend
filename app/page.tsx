"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const response = await getProducts({ sortBy: "newest" });
      if (response.success) {
        setFeaturedProducts(response.data.slice(0, 4));
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                당신의 발걸음을
                <br />
                특별하게
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                최고의 브랜드, 최신 트렌드의 신발을 만나보세요.
                <br className="hidden md:inline" />
                SHOEMOA에서 당신만의 스타일을 찾아보세요.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/products">
                    지금 쇼핑하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">신상품</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  새롭게 입고된 상품을 만나보세요
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/products">
                  전체보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/products">
                  전체 상품 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-12">
              카테고리
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "러닝화", desc: "편안한 착화감" },
                { name: "스니커즈", desc: "일상의 스타일" },
                { name: "캔버스", desc: "클래식한 디자인" },
                { name: "농구화", desc: "코트의 전설" },
              ].map((category) => (
                <Link
                  key={category.name}
                  href="/products"
                  className="group p-6 bg-background rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold group-hover:underline">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <Link href="/" className="inline-block">
                  <span className="text-xl font-bold tracking-tight">SHOEMOA</span>
                  <span className="text-xs text-muted-foreground ml-2">슈모아</span>
                </Link>
                <p className="text-sm text-muted-foreground mt-2">
                  최고의 신발을 최고의 가격에
                </p>
              </div>
              <div className="flex gap-8 text-sm">
                <div className="space-y-3">
                  <h4 className="font-medium">쇼핑</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><Link href="/products" className="hover:text-foreground">전체 상품</Link></li>
                    <li><Link href="/products" className="hover:text-foreground">신상품</Link></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">계정</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><Link href="/login" className="hover:text-foreground">로그인</Link></li>
                    <li><Link href="/signup" className="hover:text-foreground">회원가입</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
              <p>2025 SHOEMOA. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
