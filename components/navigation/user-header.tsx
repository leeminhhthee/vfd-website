"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import clsx from "clsx";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: trans.home, href: "/" },
    { label: trans.news, href: "/news" },
    { label: trans.resources, href: "/documents" },
    { label: trans.scheduleAndResults, href: "/schedule" },
    { label: trans.photo, href: "/gallery" },
    { label: trans.project, href: "/projects" },
    { label: trans.introduction, href: "/about" },
  ];

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <Image
              src={ASSETS.logo.vfd_logo_text}
              alt={trans.volleyFederDN}
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
                  "px-2 py-1 transition-colors duration-200 hover:text-yellow-400",
                  pathname === item.href &&
                    "text-yellow-400 border-b-2 border-yellow-400"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="p-2 hover:bg-primary-light rounded-lg transition-colors"
            >
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
                  "block px-4 py-2 rounded-lg transition-colors hover:bg-gray-100 hover:text-yellow-400",
                  pathname === item.href && "text-yellow-400 bg-gray-50"
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
  );
}
