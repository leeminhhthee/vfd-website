"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Calendar, Users, Trophy, ImageIcon, Settings, ChevronRight } from "lucide-react"
import Image from "next/image"

interface AdminSidebarProps {
  open: boolean
}

export default function AdminSidebar({ open }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Tin tức", href: "/admin/news", icon: FileText },
    { label: "Tài liệu", href: "/admin/documents", icon: FileText },
    { label: "Lịch thi đấu", href: "/admin/schedule", icon: Calendar },
    { label: "Giải đấu", href: "/admin/tournaments", icon: Trophy },
    { label: "Người dùng", href: "/admin/users", icon: Users },
    { label: "Hình ảnh", href: "/admin/photos", icon: ImageIcon },
    { label: "Cài đặt", href: "/admin/settings", icon: Settings },
  ]

  return (
    <aside className={`${open ? "w-64" : "w-20"} bg-primary text-white transition-all duration-300 overflow-y-auto`}>
      <div className="p-4 border-b border-primary-light">
        <Link href="/admin" className="flex items-center gap-3 font-bold text-lg">
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
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-accent text-primary font-medium" : "hover:bg-primary-light text-white"
                }`}
            >
              <Icon size={20} className="shrink-0" />
              {open && <span className="text-sm">{item.label}</span>}
              {open && isActive && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
