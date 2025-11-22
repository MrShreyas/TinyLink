"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function LinkModal({
  onClose,
  onSubmit,
}: { onClose: () => void; onSubmit: (longUrl: string, customCode?: string) => void }) {
  const [longUrl, setLongUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!longUrl) {
      setError("Please enter a URL")
      return
    }

    try {
      new URL(longUrl)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setLoading(true)
    setTimeout(() => {
      onSubmit(longUrl, customCode && customCode.trim() ? customCode.trim() : undefined)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Create Short URL</h2>

        {error && (
          <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Long URL</label>
            <Input
              type="url"
              placeholder="https://example.com/very-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Custom short code (optional)</label>
            <Input
              type="text"
              placeholder="e.g. my-code or custom123"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
            <p className="text-xs text-foreground/70">Only letters, numbers, hyphen and underscore allowed. 3-20 characters.</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
