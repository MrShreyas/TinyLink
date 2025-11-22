"use client"

import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70">Configure your preferences</p>
      </div>

      <Card className="p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-foreground/70">Receive updates on your links</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Weekly Report</p>
              <p className="text-sm text-foreground/70">Get a weekly summary of analytics</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </Card>

      <Card className="p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">API Key</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-foreground/70 mb-2">Your API Key</p>
            <div className="flex gap-2">
              <input
                type="password"
                value="sk_live_1234567890abcdef"
                readOnly
                className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm font-mono"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded text-sm font-medium">
                Copy
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
