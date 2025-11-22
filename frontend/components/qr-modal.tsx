"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function QRModal({ code, onClose }: { code: string; onClose: () => void }) {
  const handleDownload = () => {
    // Mock download QR code
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const link = document.createElement("a")
      link.href = canvas.toDataURL()
      link.download = `qr-${code}.png`
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground text-center">QR Code</h2>

        <div className="flex justify-center">
          <canvas
            ref={(canvas) => {
              if (canvas) {
                const ctx = canvas.getContext("2d")
                if (ctx) {
                  canvas.width = 200
                  canvas.height = 200
                  ctx.fillStyle = "#ffffff"
                  ctx.fillRect(0, 0, 200, 200)
                  ctx.fillStyle = "#2E86AB"
                  for (let i = 0; i < 200; i++) {
                    for (let j = 0; j < 200; j++) {
                      if (Math.random() > 0.6) {
                        ctx.fillRect(i, j, 1, 1)
                      }
                    }
                  }
                }
              }
            }}
            className="border-4 border-primary"
          />
        </div>

        <p className="text-center text-sm text-foreground/70">short.link/{code}</p>

        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex-1 bg-accent hover:bg-accent/90 text-neutral">
            Download
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}
