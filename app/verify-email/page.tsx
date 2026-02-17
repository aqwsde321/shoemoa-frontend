"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("유효하지 않은 인증 링크입니다.");
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(email, token);
        if (response.success) {
          setStatus("success");
          setMessage("이메일 인증이 완료되었습니다. 이제 로그인이 가능합니다.");
        } else {
          setStatus("error");
          setMessage(response.message || "인증에 실패했습니다. 링크가 만료되었거나 이미 사용되었을 수 있습니다.");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "인증 처리 중 오류가 발생했습니다.");
      }
    };

    verify();
  }, [email, token]);

  return (
    <div className="text-center space-y-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">이메일 인증 중...</h2>
          <p className="text-muted-foreground">잠시만 기다려 주세요.</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold">인증 성공!</h2>
          <p className="text-muted-foreground">{message}</p>
          <Button asChild className="mt-4 px-8">
            <Link href="/login">로그인하러 가기</Link>
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-bold">인증 실패</h2>
          <p className="text-muted-foreground">{message}</p>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" asChild>
              <Link href="/">홈으로</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">회원가입 다시하기</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>홈으로</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 bg-secondary/30 rounded-2xl border border-secondary">
          <Suspense fallback={
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">인증 정보를 불러오는 중...</p>
            </div>
          }>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
