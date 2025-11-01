"use client"

import type React from "react"
import UserHeader from "@/components/navigation/user-header"
import UserFooter from "@/components/navigation/user-footer"

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-y-scroll snap-y snap-mandatory">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <UserFooter />    
    </div>
  )
}
