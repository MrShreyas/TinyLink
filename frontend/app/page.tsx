"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">Shorten Your URLs</h1>

          <p className="text-xl text-foreground/80">Shorten URLs, track analytics, manage links. All in one place.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/login">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                Shorten URL
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-lg border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                Get Started
              </Button>
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">⚡</div>
              <h3 className="font-semibold text-foreground">Fast & Easy</h3>
              <p className="text-sm text-foreground/70">Create short links in seconds</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">📊</div>
              <h3 className="font-semibold text-foreground">Analytics</h3>
              <p className="text-sm text-foreground/70">Track clicks and performance</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">🔒</div>
              <h3 className="font-semibold text-foreground">Secure</h3>
              <p className="text-sm text-foreground/70">Your links are always safe</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
