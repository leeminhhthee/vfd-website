"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (!accessToken || !userString) {
      router.replace("/login"); // chưa login
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (!user.admin) {
        router.replace("/");
        return;
      }
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      router.replace("/login");
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
