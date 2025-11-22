"use client"

import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-foreground/70">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Links" value="24" change="+3 this month" />
        <StatCard label="Total Clicks" value="1,234" change="+156 this week" />
        <StatCard label="Avg. CTR" value="5.2%" change="↑ 0.3%" />
        <StatCard label="Active Links" value="22" change="2 paused" />
      </div>

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {[
            { link: "short.link/abc123", clicks: 45, date: "2 hours ago" },
            { link: "short.link/xyz789", clicks: 32, date: "1 day ago" },
            { link: "short.link/def456", clicks: 18, date: "3 days ago" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-background rounded-lg border border-border"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate text-sm sm:text-base">{item.link}</p>
                <p className="text-xs sm:text-sm text-foreground/60">{item.date}</p>
              </div>
              <p className="font-semibold text-accent text-sm sm:text-base flex-shrink-0">{item.clicks} clicks</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
