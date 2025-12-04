"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAdminGuard = () => {
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
        router.replace("/"); // không phải admin
        return;
      }
    } catch (err) {
      // dữ liệu user lỗi
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      router.replace("/login");
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return isLoading;
};
