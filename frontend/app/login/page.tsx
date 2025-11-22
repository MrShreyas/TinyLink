"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import AuthServices from "@/services/authServices"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)
    try {
      const res = await AuthServices.login({ email, password })
      console.log(res)
      if (!res) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }
      localStorage.setItem("userId", res.user.id)
      console.log("User ID stored:", res.user.id)
      console.log(localStorage.getItem("userId"))
      setLoading(false)
      router.push("/dashboard")
    } catch (error) {
      setError("An error occurred during login")
      setLoading(false)
      return
    }
    setLoading(false)
    return
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <Card className="w-full max-w-md">
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
              <p className="text-foreground/70">Sign in to your account</p>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="space-y-3 text-sm text-center">
              <p className="text-foreground/70">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Create one
                </Link>
              </p>
              <Link href="#" className="text-primary hover:underline block">
                Forgot password?
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
