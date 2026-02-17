"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";

const formSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력하세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: FormData) => {
    try {
      const role = await login(data);
      if (role) {
        if (role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        form.setError("root", { message: "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요." });
      }
    } catch (error: any) {
      console.log("Login error caught in UI:", error);
      let errorMessage = "로그인 중 오류가 발생했습니다.";

      if (error.status === 401) {
        // 백엔드에서 온 구체적인 메시지가 있다면 우선 사용
        if (error.message && error.code === "INVALID_CREDENTIALS") {
          errorMessage = error.message; 
        } else {
          errorMessage = "이메일 또는 비밀번호가 일치하지 않습니다.";
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      form.setError("root", { message: errorMessage });
    }
  };

  return (
    <>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold tracking-tight">SHOEMOA</h1>
              <p className="text-xs text-muted-foreground">슈모아</p>
            </Link>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...form.register("email")}
                  className="h-12 bg-secondary border-0 focus-visible:ring-foreground"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    {...form.register("password")}
                    className="h-12 bg-secondary border-0 pr-12 focus-visible:ring-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}</span>
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
            </div>

            {errors.root && (
              <p className="text-sm text-destructive text-center">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-sm font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              아직 계정이 없으신가요?{" "}
              <Link href="/signup" className="font-medium text-foreground hover:underline">
                회원가입
              </Link>
            </p>


          </div>
        </div>
      </main>
    </>
  );
}
