"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export default function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/news" },
    { label: "Tài liệu", href: "/documents" },
    { label: "Lịch thi đấu - Kết quả", href: "/schedule" },
    { label: "Photo", href: "#" },
    { label: "Dự án", href: "/projects" },
    { label: "Giới thiệu", href: "/about" },
  ]

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <Image
              src="/logo-vfd-full.png"
              alt="Liên đoàn Bóng chuyền TP Đà Nẵng"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 uppercase font-black relative">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-2 py-1 transition-colors duration-200 hover:text-orange-600",
                  pathname === item.href && "text-orange-600 border-b-2 border-orange-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="p-2 hover:bg-primary-light rounded-lg transition-colors">
              <Search size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary-light rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 uppercase font-bold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block px-4 py-2 rounded-lg transition-colors hover:bg-gray-100",
                  pathname === item.href && "text-orange-600 bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
