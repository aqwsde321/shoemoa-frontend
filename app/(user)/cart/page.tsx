"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { getCart, updateCartItem, removeFromCart } from "@/lib/api";
import type { CartItem } from "@/lib/types";

export default function CartPage() {
  const router = useRouter();
  const { authenticatedFetch, isLoading: isAuthLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getCart(authenticatedFetch);
        if (response.success) {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("[v0] Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!isAuthLoading) {
      fetchCart();
    }
  }, [authenticatedFetch, isAuthLoading]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem(authenticatedFetch, itemId, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("[v0] Failed to update cart:", error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(authenticatedFetch, itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("[v0] Failed to remove item:", error);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    router.push("/order");
  };

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-32" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-secondary rounded-lg">
              <div className="w-24 h-24 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>쇼핑 계속하기</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-8">장바구니</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground mt-4">장바구니가 비어있습니다</p>
            <Button asChild className="mt-6">
              <Link href="/products">쇼핑하러 가기</Link>
            </Button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.productId}`}
                    className="shrink-0"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-md bg-secondary">
                      <img
                        src={item.product.thumbnailUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.selectedColor} / {item.selectedSize}mm
                      </p>
                      <p className="font-semibold mt-2">
                        {formatPrice(item.product.price)}원
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">수량 감소</span>
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">수량 증가</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">삭제</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-24 p-6 bg-card rounded-lg border border-border">
                <h2 className="text-lg font-semibold mb-4">주문 요약</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">상품 수</span>
                    <span>{totalItems}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">배송비</span>
                    <span>무료</span>
                  </div>
                </div>

                <div className="border-t border-border my-4" />

                <div className="flex justify-between font-semibold">
                  <span>총 결제금액</span>
                  <span>{formatPrice(totalAmount)}원</span>
                </div>

                <Button
                  className="w-full h-12 mt-6"
                  onClick={handleCheckout}
                >
                  주문하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
