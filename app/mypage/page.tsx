"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPage() {
  const { userEmail, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            쇼핑계속하기
          </Link>
        </Button>
      </div>

      <div className="rounded-3xl border border-border/50 shadow-xl overflow-hidden bg-white dark:bg-zinc-950">
        {/* Header Section */}
        <div className="bg-primary/5 py-10 px-6 border-b border-border/50 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-full shadow-lg ring-8 ring-primary/5 transition-transform hover:scale-105 duration-300">
              <User className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">마이페이지</h1>
          <p className="text-muted-foreground font-medium">회원님의 소중한 정보를 확인하세요</p>
        </div>
        
        {/* Content Section */}
        <div className="p-8 space-y-8">
          <div className="group flex items-center gap-5 p-5 rounded-2xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all duration-300">
            <div className="p-3 bg-primary rounded-xl shadow-md shadow-primary/20 transition-transform group-hover:rotate-6">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">이메일 계정</p>
              <p className="text-xl font-bold text-foreground">{userEmail}</p>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 text-orange-800 dark:text-orange-300 text-sm flex gap-4 items-start shadow-sm">
            <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 font-bold border border-orange-200 dark:border-orange-800">!</div>
            <p className="leading-relaxed">보안을 위해 비밀번호는 주기적으로 변경하시는 것이 좋습니다. <br /><span className="text-[11px] font-bold opacity-70">(비밀번호 변경 기능은 현재 준비 중입니다)</span></p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-secondary/20 p-8 border-t border-border/50">
          <Button 
            variant="outline" 
            className="w-full h-14 gap-3 bg-white dark:bg-zinc-900 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive hover:text-destructive transition-all duration-300 font-bold rounded-xl shadow-sm hover:shadow-md"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            현 기기에서 로그아웃
          </Button>
          <div className="mt-6 flex flex-col gap-1 items-center">
            <p className="text-[11px] text-muted-foreground font-medium">
              계정 탈퇴 또는 정보 수정 문의는 고객센터를 이용해 주세요.
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-[10px] text-muted-foreground underline cursor-pointer hover:text-primary transition-colors">이용약관</span>
              <span className="text-[10px] text-muted-foreground underline cursor-pointer hover:text-primary transition-colors">개인정보처리방침</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
