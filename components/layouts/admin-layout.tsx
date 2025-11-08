"use client"

import AdminHeader from "@/components/navigation/admin-header"
import AdminSidebar from "@/components/navigation/admin-sidebar"
import type React from "react"
import { useEffect, useState } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  useEffect(() => {
    if (isDesktop || !sidebarOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isDesktop, sidebarOpen])

  return (
    <div className="flex h-screen bg-muted">
      {isDesktop && <AdminSidebar open={sidebarOpen} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          onToggleSidebar={() => {
            setSidebarOpen((v) => !v)
          }}
        />

        {!isDesktop && (
          <>
            <div
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
                sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <div
              className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] transform transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              role="dialog"
              aria-modal="true"
            >
              <AdminSidebar open={sidebarOpen} />
            </div>
          </>
        )}

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}