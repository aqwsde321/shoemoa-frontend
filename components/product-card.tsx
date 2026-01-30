"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
        <img
          src={product.img || "/placeholder.svg"} // Use product.img
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          // crossOrigin="anonymous" // Commented out as it might cause issues with external images
        />
        {/* Stock related logic - currently commented out as 'stock' is not in current API response */}
        {/*
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-xs font-medium px-2 py-1 rounded">
            품절임박
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">품절</span>
          </div>
        )}
        */}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:underline">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">{product.color}</p>
        <p className="text-sm font-semibold text-foreground">
          {formatPrice(product.price)}원
        </p>
      </div>
    </Link>
  );
}
