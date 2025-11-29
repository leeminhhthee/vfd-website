"use client";
import { LogOut, Menu, User } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
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
          <span className="text-sm text-foreground font-medium">Admin</span>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <User size={20} className="text-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <LogOut size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
