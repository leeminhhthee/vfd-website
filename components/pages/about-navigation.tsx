"use client"

import Link from "next/link"
import { useHash } from "@/hooks/use-hash"

export default function AboutNavigation() {
  const hash = useHash()

  const tabs = [
    { label: "Về chúng tôi", href: "#about" },
    { label: "Ban lãnh đạo", href: "#board" },
  ]

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-4 px-2 font-medium text-sm transition-all duration-300 border-b-2 ${
                hash === tab.href.slice(1)
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
