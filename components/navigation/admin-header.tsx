"use client";
import { authenticationInteractor } from "@/data/datasource/authentication/interactor/authentication.interactor";
import { LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  const handleLogout = async () => {
    try {
      await authenticationInteractor.logout();
    } catch (e) {
      // backend có thể đã hết token → vẫn logout frontend
      console.warn("Logout API failed, force logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");

      router.replace("/login");
    }
  };


  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="flex justify-between items-center h-16 px-6">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu size={24} className="text-foreground" />
        </button>

        <div className="flex items-center gap-4">
          {/* Full name admin */}
          <span className="text-sm text-foreground font-medium">Admin {user.fullName}</span>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User size={20} className="text-foreground" />
          </button>
          <button
            disabled={loading}
            onClick={handleLogout}
            className="p-2 hover:bg-muted rounded-lg transition-colors">
            <LogOut size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
