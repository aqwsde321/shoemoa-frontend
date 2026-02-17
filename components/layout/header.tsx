"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth"; // Import useAuth

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
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">장바구니</span>
              </Link>
            </Button>
            
            {isAuthenticated ? (
              <div className="relative group">
                {/* Profile Icon (Hover trigger) */}
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary">
                  <User className="h-5 w-5" />
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                  <div className="p-2 border-b border-border">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase px-2 py-1">계정 관리</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/mypage"
                      className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors text-left"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button asChild size="sm" className="font-semibold px-6">
                <Link href="/login">
                  로그인
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
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  href="/mypage"
                  className="block text-sm font-medium py-3 px-2 rounded-md hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  className="block text-sm font-medium py-3 px-2 w-full text-left text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Button asChild className="w-full h-11 font-semibold">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    로그인
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
