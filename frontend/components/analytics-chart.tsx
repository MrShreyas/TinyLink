"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnalyticsChart({ data }: { data: Array<{ date: string; clicks: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" stroke="var(--color-foreground)" />
        <YAxis stroke="var(--color-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: `1px solid var(--color-border)`,
            color: "var(--color-foreground)",
          }}
        />
        <Bar dataKey="clicks" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
