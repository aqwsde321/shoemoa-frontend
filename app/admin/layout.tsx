"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { AdminHeader } from "@/components/layout/admin-header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || userRole !== "ADMIN") {
        router.push("/login?message=unauthorized"); // Redirect to login if not admin
      }
    }
  }, [isLoading, isAuthenticated, userRole, router]);

  if (isLoading || !isAuthenticated || userRole !== "ADMIN") {
    // Optionally render a loading spinner or access denied message while redirecting
    return <div className="flex justify-center items-center h-screen text-lg">권한 확인 중...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      {children}
    </div>
  );
}
