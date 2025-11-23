"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"


interface LinkItem {
  code: string
  longUrl: string
  clicks: number
  lastClicked: string
  created: string
  shortUrl?: string
}

export function LinkTable({ links, onDelete }: { links: LinkItem[]; onDelete: (code: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const {toast} = useToast()
  const truncate = (str: string, len = 40) => {
    return str.length > len ? str.substring(0, len) + "..." : str
  }

  const copy = async (text: string | undefined) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      // optionally show a toast
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  if (links.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-foreground/70">No links created yet.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Short Code</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Short URL</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Target URL</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Clicks</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Clicked</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.code} className="border-b border-border hover:bg-background transition">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono bg-background px-2 py-1 rounded text-wood font-semibold">
                    {link.code}
                  </code>
                </td>
                <td className="px-6 py-4">
                  {/** short url (server may provide `shortUrl`) */}
                  <a
                    href={link.shortUrl || `/${link.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                    title={link.shortUrl || `/${link.code}`}
                  >
                    {link.shortUrl ? link.shortUrl : `${window.location.origin}/${link.code}`}
                  </a>
                    <button
                    onClick={async () => {
                      await copy(link.shortUrl || `${window.location.origin}/${link.code}`);
                      // Show a toast message on successful copy
                        toast({ title: 'Success', description: 'Copied to clipboard' });
                    }}
                    className="ml-2 p-1 cursor-pointer rounded bg-background text-foreground/70 hover:text-foreground"
                    title="Copy short URL"
                    >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15.75v1.5A2.25 2.25 0 0010.5 19.5h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0019.5 6h-1.5m-11.25 9H6A2.25 2.25 0 013.75 12V3.75A2.25 2.25 0 016 1.5h9A2.25 2.25 0 0117.25 3.75V6m-9 9l9-9"
                      />
                    </svg>
                    </button>
                </td>

                <td className="px-6 py-4">
                  <a
                    href={link.longUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                    title={link.longUrl}
                  >
                    {truncate(link.longUrl)}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-wood">{link.clicks}</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-sm text-foreground/70">
                    {new Date(link.lastClicked).toLocaleString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <Link href={`/code/${link.code}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10 bg-transparent"
                    >
                      Stats
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected(link.code)
                      setOpen(true)
                    }}
                    className="bg-danger/10 text-danger hover:bg-danger/20 shrink-0"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog  open={open} onOpenChange={(val) => { if (!val) { setSelected(null); setDeleting(false) } setOpen(val) }}>
        <DialogContent className="bg-amber-50">
          <DialogHeader>
            <DialogTitle className="text-(--color-danger-hex)" >Delete link</DialogTitle>
            <DialogDescription >Are you sure you want to delete this short link? This action cannot be undone and will remove associated statistics.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={deleting}>Cancel</Button>
            <Button
              className="bg-(--color-danger-hex)/10 text-(--color-danger-hex) hover:bg-(--color-danger-hex)/20"
              onClick={async () => {
                if (!selected) return
                try {
                  setDeleting(true)
                  await onDelete(selected)
                  setOpen(false)
                } catch (e) {
                  console.error('Delete failed', e)
                } finally {
                  setDeleting(false)
                  setSelected(null)
                }
              }}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="md:hidden divide-y divide-border">
        {links.map((link) => (
          <div key={link.code} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-foreground/70 mb-1">Short Code</p>
                <code className="text-sm font-mono bg-background px-2 py-1 rounded text-accent font-semibold">
                  {link.code}
                </code>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelected(link.code)
                  setOpen(true)
                }}
                className="bg-danger/10 text-danger hover:bg-danger/20 shrink-0"
              >
                Delete
              </Button>
            </div>

            <div>
              <p className="text-xs text-foreground/70 mb-1">Target URL</p>
              <a
                href={link.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
                title={link.longUrl}
              >
                {truncate(link.longUrl, 25)}
              </a>
            </div>

            <div>
              <p className="text-xs text-foreground/70 mb-1">Short URL</p>
              <div className="flex items-center gap-2">
                <a
                  href={link.shortUrl || `/${link.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                  title={link.shortUrl || `/${link.code}`}
                >
                  {link.shortUrl ? link.shortUrl : `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.code}`}
                </a>
                <button
                  onClick={() => copy(link.shortUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.code}`)}
                  className="text-xs text-foreground/70 hover:text-foreground"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-foreground/70 mb-1">Total Clicks</p>
                <span className="text-lg font-semibold text-accent">{link.clicks}</span>
              </div>
              <div>
                <p className="text-xs text-foreground/70 mb-1">Last Clicked</p>
                <span className="text-sm text-foreground/70">{link.lastClicked}</span>
              </div>
            </div>

            <Link href={`/dashboard/links/${link.code}`}>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-primary border-primary hover:bg-primary/10 bg-transparent"
              >
                View Stats
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  )
}
