"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth.tsx"; // Import useAuth

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth(); // Use useAuth hook

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SHOEMOA</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">슈모아</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              상품목록
            </Link>
            {isAuthenticated && userRole === "ADMIN" && ( // Conditionally render Admin Dashboard link
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                관리자 대시보드
              </Link>
            )}
            <Link
              href="/cart"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              장바구니
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">장바구니</span>
              </Link>
            </Button>
            {isAuthenticated ? ( // Conditionally render Login/Logout button
              <Button variant="ghost" size="icon" onClick={logout}>
                <User className="h-5 w-5" />
                <span className="sr-only">로그아웃</span>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">로그인</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">메뉴</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              상품목록
            </Link>
            {isAuthenticated && userRole === "ADMIN" && ( // Conditionally render Admin Dashboard link
              <Link
                href="/admin"
                className="block text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                관리자 대시보드
              </Link>
            )}
            <Link
              href="/cart"
              className="block text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              장바구니
            </Link>
            {isAuthenticated ? ( // Conditionally render Login/Logout button
              <button
                className="block text-sm font-medium py-2 w-full text-left"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                로그아웃
              </button>
            ) : (
              <Link
                href="/login"
                className="block text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
