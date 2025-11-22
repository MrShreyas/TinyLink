"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LinkModal } from "@/components/link-modal"
import { LinkTable } from "@/components/link-table"
import LinkServices from '@/services/linkServices'

export default function LinksPage() {
  const [showModal, setShowModal] = useState(false)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAddLink = async (longUrl: string, customCode?: string) => {
    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      const payload: any = { longUrl }
      if (userId) payload.userId = userId
      if (customCode) payload.customCode = customCode
      const res = await LinkServices.createLink(payload)

      // server expected response: { shortcode, shortUrl }
      const shortcode = res?.shortcode || res?.shortCode || res?.code
      const shortUrl = res?.shortUrl

      const created = {
        code: shortcode || (Math.random().toString(36).substring(2, 8)),
        longUrl,
        clicks: 0,
        lastClicked: 'Never',
        created: new Date().toISOString().split('T')[0],
        shortUrl,
      }

      setLinks((prev) => [created, ...prev])
    } catch (err) {
      console.error('Create link failed', err)
      throw err
    } finally {
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await LinkServices.getAll()
        const mapped = (res || []).map((r: any) => ({
          code: r.shortcode || r.code || r.shortCode,
          longUrl: r.target_url || r.long_url || r.longUrl || r.targetUrl,
          clicks: r.total_clicks || r.clicks || 0,
          lastClicked: r.last_clicked || r.lastClicked || 'Never',
          created: r.created_at || r.createdAt || r.created || '',
          shortUrl: r.shortUrl || (r.shortcode ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${r.shortcode}` : undefined),
        }))
        if (mounted) setLinks(mapped.reverse())
      } catch (err: any) {
        console.error('Failed to load links', err)
        if (mounted) setError(err?.message || 'Failed to load links')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleDeleteLink = (code: string) => {
    setLinks(links.filter((l) => l.code !== code))
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Links</h1>
          <p className="text-sm md:text-base text-foreground/70">Manage all your shortened URLs</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          + Create Short URL
        </Button>
      </div>

      {loading ? <p>Loading...</p> : error ? <p className="text-danger">{error}</p> : <LinkTable links={links} onDelete={handleDeleteLink} />}

      {showModal && <LinkModal onClose={() => setShowModal(false)} onSubmit={handleAddLink} />}
    </div>
  )
}
