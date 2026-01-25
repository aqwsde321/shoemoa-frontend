"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getCart, createOrder } from "@/lib/api";
import type { CartItem } from "@/lib/types";

export default function OrderPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getCart();
        if (response.success) {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("[v0] Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmitOrder = async () => {
    setIsOrdering(true);
    try {
      const cartItemIds = cartItems.map((item) => item.id);
      const response = await createOrder(cartItemIds);
      if (response.success) {
        setOrderId(response.data.id);
        setIsComplete(true);
      }
    } catch (error) {
      console.error("[v0] Failed to create order:", error);
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-secondary rounded w-32" />
            <div className="h-40 bg-secondary rounded-lg" />
            <div className="h-32 bg-secondary rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-foreground rounded-full flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-background" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              주문이 완료되었습니다
            </h1>
            <p className="text-muted-foreground">
              주문번호: {orderId}
            </p>
            <div className="mt-8 space-y-3">
              <Button asChild className="w-full max-w-xs">
                <Link href="/products">쇼핑 계속하기</Link>
              </Button>
              <Button variant="outline" asChild className="w-full max-w-xs bg-transparent">
                <Link href="/">홈으로</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">주문할 상품이 없습니다</h1>
            <Button asChild>
              <Link href="/products">쇼핑하러 가기</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>장바구니로</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-8">주문하기</h1>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Products */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-semibold mb-4">주문 상품</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 overflow-hidden rounded-md bg-secondary shrink-0">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.selectedColor} / {item.selectedSize}mm x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium shrink-0">
                    {formatPrice(item.product.price * item.quantity)}원
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="font-semibold mb-4">결제 금액</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 금액</span>
                <span>{formatPrice(totalAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span>무료</span>
              </div>
              <div className="border-t border-border pt-3 mt-3" />
              <div className="flex justify-between text-base font-semibold">
                <span>총 결제금액</span>
                <span>{formatPrice(totalAmount)}원</span>
              </div>
            </div>
          </div>

          {/* Notice */}
          <p className="text-xs text-muted-foreground text-center">
            주문 버튼을 클릭하면 결제가 진행됩니다.
            <br />
            (데모 앱이므로 실제 결제는 이루어지지 않습니다)
          </p>

          {/* Submit Button */}
          <Button
            className="w-full h-12"
            onClick={handleSubmitOrder}
            disabled={isOrdering}
          >
            {isOrdering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                주문 처리 중...
              </>
            ) : (
              <>{formatPrice(totalAmount)}원 결제하기</>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
