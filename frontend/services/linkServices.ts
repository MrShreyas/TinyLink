import api from '../lib/axios'

type CreateLinkPayload = {
  longUrl: string
  userId?: string | number | null
  customCode?: string
}

type LinkMetadata = {
  shortcode: string
  target_url: string
  total_clicks: number
  last_clicked?: string | null
  created_at?: string
}

type DailyPoint = { date: string; clicks: number }

type LinkStats = {
  shortcode: string
  shortUrl?: string
  target_url: string
  total_clicks: number
  last_clicked?: string | null
  created_at?: string
  stats: {
    daily: DailyPoint[]
    referrers?: Array<{ source: string; clicks: number }>
    locations?: Array<{ country: string; clicks: number }>
    devices?: Array<{ device: string; clicks: number }>
  }
}

const LinkServices = {
  // POST /short/create
  createLink: async (payload: CreateLinkPayload) => {
    const res = await api.post('/api/links', payload)
    return res.data
  },

  // GET /short/:shortcode  -> returns metadata (+ stats)
  getMetadata: async (shortcode: string, days = 7): Promise<any | null> => {
    const res = await api.get(`/api/links/${encodeURIComponent(shortcode)}?days=${days}`)
    return res.data || null
  },

  // GET /short/:shortcode -> returns metadata and stats
  getStats: async (shortcode: string, days = 7): Promise<LinkStats | null> => {
    try {
      const res = await api.get(`/api/links/${encodeURIComponent(shortcode)}?days=${days}`)
      const data = res.data
      if (!data) return null

      // ensure daily is an array of {date, clicks}
      const daily: DailyPoint[] = Array.isArray(data.stats?.daily)
        ? data.stats.daily.map((d: any) => ({ date: String(d.date), clicks: Number(d.clicks || 0) }))
        : []

      const stats = {
        daily,
        referrers: data.stats?.referrers || [],
        locations: data.stats?.locations || [],
        devices: data.stats?.devices || [],
      }

      const result: LinkStats = {
        shortcode: data.shortcode,
        shortUrl: data.shortUrl,
        target_url: data.target_url,
        total_clicks: data.total_clicks,
        last_clicked: data.last_clicked,
        created_at: data.created_at,
        stats,
      }

      return result
    } catch (err) {
      // forward error for caller to handle
      throw err
    }
  },

  // GET /short/all -> return all short links (no stats)
  getAll: async (): Promise<any[]> => {
    const res = await api.get('/api/links')
    // normalize common shapes
    const data = res.data
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.rows)) return data.rows
    return []
  },

  // DELETE /short/:shortcode -> delete a short link
  deleteLink: async (shortcode: string): Promise<boolean> => {
    try {
      await api.delete(`/api/links/${encodeURIComponent(shortcode)}`)
      return true
    } catch (err) {
      // forward error for caller to handle
      throw err
    }
  },
  
 
}

export type { CreateLinkPayload, LinkMetadata }
export default LinkServices
