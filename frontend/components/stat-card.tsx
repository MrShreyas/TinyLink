import { Card } from "@/components/ui/card"

export function StatCard({ label, value, change, className, }: { label: string; value: string; change?: string; className?: string }) {
  return (
    <Card className={`p-6 ${className || ''}`}>
      <p className="text-sm text-foreground/70 font-medium">{label}</p>
      <p className="text-3xl font-bold text-primary mt-2">{value}</p>
      {change && <p className="text-xs text-foreground/60 mt-2">{change}</p>}
    </Card>
  )
}
