"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import AuthServices from "@/services/authServices"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { open, setOpen } = useSidebar()

  const handleLogout = () => {
    AuthServices.logout()
    router.push("/")
  }

  const handleNavigation = () => {
    setOpen(false)
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/links", label: "Links", icon: "🔗" },
    { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <>
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed md:static md:w-64 h-full bg-card border-r border-border flex flex-col transition-transform duration-300 z-30 ${
          open ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-primary">LinkShort</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavigation}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === link.href ? "bg-primary text-white" : "text-foreground hover:bg-background"
              }`}
            >
              <span>{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
