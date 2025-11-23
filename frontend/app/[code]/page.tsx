"use client"

import { redirect, useParams } from 'next/navigation'

export default function ShortcodeRedirectPage() {
  const params = useParams()
    const code = params.code as string

  // Prefer a configured backend URL; fallback to the Render deployment domain
  const backend = process.env.NEXT_PUBLIC_API_URL || 'https://tinylink-backend.onrender.com'
  const target = `${backend.replace(/\/$/, '')}/${encodeURIComponent(code)}`

  // Server-side redirect to the backend's redirect handler. The backend will
  // issue the final 302 to the actual target URL and record analytics.
  redirect(target)
}
