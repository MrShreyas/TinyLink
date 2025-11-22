"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <SidebarInset className="w-full">
          <div className="flex flex-col h-full overflow-hidden w-full">
            <DashboardHeader user={user} />
            <main className="flex-1 overflow-auto bg-background">{children}</main>
          </div>
        </SidebarInset>
      </div>
      <div className="md:hidden fixed inset-0 z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <Sidebar />
        </div>
      </div>
    </SidebarProvider>
  )
}
