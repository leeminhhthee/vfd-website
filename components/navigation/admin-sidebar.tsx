"use client";

import {
  Calendar,
  ChevronRight,
  FileText,
  Handshake,
  ImageIcon,
  LayoutDashboard,
  Notebook,
  ScanEye,
  Settings,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  open: boolean;
}

export default function AdminSidebar({ open }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Tin tức", href: "/admin/news", icon: FileText },
    { label: "Tài liệu", href: "/admin/documents", icon: FileText },
    {
      label: "Giải đấu - Kết quả",
      icon: Trophy,
      subItems: [
        { label: "Giải đấu", href: "/admin/tournaments", icon: Trophy },
        { label: "Lịch thi đấu", href: "/admin/schedule", icon: Calendar },
        { label: "Duyệt đơn", href: "/admin/registrations", icon: UserCheck },
      ],
    },
    { label: "Đối tác", href: "/admin/partners", icon: Handshake },
    { label: "Hình ảnh", href: "/admin/gallerys", icon: ImageIcon },
    { label: "Dự án", href: "/admin/projects", icon: Notebook },
    { label: "Thành viên", href: "/admin/members", icon: Users },
    { label: "Hành động", href: "/admin/logs", icon: ScanEye },
    { label: "Cài đặt", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-primary text-white transition-all duration-300 overflow-y-auto`}
    >
      <div className="p-4 border-b border-primary-light">
        <Link
          href="/admin"
          className="flex items-center gap-3 font-bold text-lg"
        >
          <Image
            src="/logo-vfd-full.png"
            alt="Liên đoàn Bóng chuyền TP Đà Nẵng"
            width={120}
            height={60}
            className="h-12 w-auto"
          />
          {open && <span>Admin</span>}
        </Link>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasSub = !!item.subItems;
          const isActive =
            pathname === item.href ||
            item.subItems?.some((sub) => pathname === sub.href);

          return (
            <div key={item.label} className="relative">
              {/* Main menu item */}
              {hasSub ? (
                <div
                  onClick={() =>
                    setOpenSubmenu(
                      openSubmenu === item.label ? null : item.label
                    )
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-accent text-primary font-medium"
                      : "hover:bg-primary-light text-white"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  {open && <span className="text-sm">{item.label}</span>}
                  {open && <ChevronRight size={16} className="ml-auto" />}
                </div>
              ) : (
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-primary font-medium"
                      : "hover:bg-primary-light text-white"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  {open && <span className="text-sm">{item.label}</span>}
                </Link>
              )}

              {/* Submenu (click only) */}
              {hasSub && open && openSubmenu === item.label && (
                <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-lg shadow-lg z-50">
                  {item.subItems!.map((sub, index) => {
                    const SubIcon = sub.icon;
                    const isSubActive = pathname === sub.href;
                    const isFirst = index === 0;
                    const isLast = index === item.subItems!.length - 1;

                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`
                          flex items-center gap-2 px-4 py-2 text-sm transition-colors text-primary
                          ${
                            isSubActive
                              ? "bg-accent text-primary font-medium"
                              : "hover:bg-accent-light"
                          }
                          ${isFirst ? "rounded-t-lg" : ""}
                          ${isLast ? "rounded-b-lg" : ""}
                        `}
                      >
                        <SubIcon size={16} className="text-primary" />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
