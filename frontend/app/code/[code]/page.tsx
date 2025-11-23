"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { AnalyticsChart } from "@/components/analytics-chart"
import { QRModal } from "@/components/qr-modal"
import { useState, useEffect } from "react"
import LinkServices from '@/services/linkServices'

export default function LinkStatsPage() {
  const params = useParams()
  const code = params.code as string
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsData, setStatsData] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await LinkServices.getStats(code, 7)
        if (mounted) setStatsData(res)
      } catch (err: any) {
        console.error('Failed to load stats', err)
        if (mounted) setError(err?.message || 'Failed to load stats')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [code])

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Link Analytics</h1>
        <p className="text-foreground/70">
          <span className="font-mono text-primary">short.link/{code}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Clicks" value={(statsData?.total_clicks || 0).toString()} />
        <StatCard label="Short Code" value={String(statsData?.shortcode || '-') } />
        <Card className={`p-6`}>
          <p className="text-sm text-foreground/70 font-medium">Target URL</p>
          <p className="text-md overflow-clip font-bold text-primary">{statsData?.target_url || '-'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Last 7 Days</h2>
            {loading ? (
              <div className="text-sm text-foreground/70">Loading chart…</div>
            ) : (
              <AnalyticsChart data={(statsData?.stats?.daily || []).map((d: any) => ({ date: d.date, clicks: d.clicks }))} />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <Button onClick={() => setShowQR(true)} className="w-full bg-primary hover:bg-primary/90 text-white">
              Show QR Code
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Share</h3>
            <div className="space-y-2">
              <input
                type="text"
                readOnly
                value={statsData?.shortUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${code}` : `/${code}`)}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm"
              />
              <Button
                onClick={() => navigator.clipboard.writeText(statsData?.shortUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${code}` : `/${code}`))}
                className="w-full bg-accent hover:bg-accent/90 text-neutral"
              >
                Copy Link
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Top Referrers</h3>
          <div className="space-y-2">
            {(statsData?.stats?.referrers || []).map((ref: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-background rounded">
                <span className="text-sm text-green">{ref.referrer}</span>
                <span className="text-sm font-semibold text-wood">{ref.clicks}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Top Locations</h3>
          <div className="space-y-2">
            {(statsData?.stats?.locations || []).map((loc: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-background rounded">
                <span className="text-sm text-foreground">{loc.country}</span>
                <span className="text-sm font-semibold text-wood">{loc.clicks}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Devices</h3>
        <div className="space-y-3">
          {(statsData?.stats?.devices || []).map((dev: any, i: number) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{dev.device}</span>
                <span className="text-sm font-semibold text-wood">{dev.clicks}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(dev.clicks / (statsData?.total_clicks || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showQR && <QRModal code={code} onClose={() => setShowQR(false)} />}
    </div>
  )
}
