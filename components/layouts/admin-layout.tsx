"use client"

import type React from "react"
import { useState } from "react"
import AdminSidebar from "@/components/navigation/admin-sidebar"
import AdminHeader from "@/components/navigation/admin-header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-muted">
      <AdminSidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
