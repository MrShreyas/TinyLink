"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">🔗</div>
            <span className="text-lg sm:text-xl font-bold text-primary">LinkShort</span>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-background transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>

          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <Link href="/" className="text-foreground hover:text-primary transition">
                  Home
                </Link>
                <Link href="#" className="text-foreground hover:text-primary transition">
                  Features
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-medium"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-primary transition">
                  Dashboard
                </Link>
                <span className="text-foreground/70">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-danger text-danger hover:bg-danger/10 transition font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-4">
            {!user ? (
              <>
                <Link
                  href="/"
                  className="block px-4 py-2 text-foreground hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 text-foreground hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-foreground hover:text-primary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <p className="px-4 py-2 text-foreground/70">{user.name}</p>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-lg border border-danger text-danger hover:bg-danger/10 transition font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
