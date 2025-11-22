"use client"

import { Menu, X } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function DashboardHeader({ user }: { user: any }) {
  const { open, setOpen } = useSidebar()

  return (
    <header className="bg-card border-b border-border px-4 md:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-background transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle sidebar"
        >
          {open ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
        </button>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-lg font-semibold text-foreground truncate">Welcome, {user?.name || "User"}</h2>
          <p className="text-xs sm:text-sm text-foreground/70 truncate">{user?.email}</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white font-bold">
        {user?.name?.charAt(0).toUpperCase() || "U"}
      </div>
    </header>
  )
}
