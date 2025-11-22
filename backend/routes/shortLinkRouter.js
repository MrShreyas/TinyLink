const express = require('express');
const { customAlphabet } = require('nanoid');
const linkQueries = require('../db/linkQueries');

const router = express.Router();

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

// Create short link
router.post('/create', async (req, res) => {
  try {
    const { longUrl, userId } = req.body || {};
    if (!longUrl) return res.status(400).json({ error: 'longUrl is required' });

    // generate unique shortcode, retry on conflict
    let shortcode;
    let created = null;
    for (let i = 0; i < 5; i++) {
      shortcode = nanoid();
      try {
        created = await linkQueries.createLink(req.user.id, shortcode, longUrl);
        break;
      } catch (err) {
        // unique violation -> retry
        if (err && err.code === '23505') continue;
        throw err;
      }
    }

    if (!created) return res.status(500).json({ error: 'Could not create shortcode' });

    res.status(201).json({ shortcode: created.shortcode, shortUrl: `${req.protocol}://${req.get('host')}/${created.shortcode}` });
  } catch (err) {
    console.error('Create short error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all short links (no statistics)
router.get('/all', async (req, res) => {
  try {
    // Require authentication: route should be protected by middleware, but double-check
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Authentication required' });

    const result = await linkQueries.findByUserId(req.user.id);
    let rows = Array.isArray(result) ? result : (result && result.rows) || result;

    const host = req.get('host');
    const proto = req.protocol;
    const mapped = rows.map(r => ({
      shortcode: r.shortcode,
      shortUrl: `${proto}://${host}/${r.shortcode}`,
      target_url: r.target_url,
      total_clicks: r.total_clicks,
      last_clicked: r.last_clicked,
    }));

    return res.json(mapped);
  } catch (err) {
    console.error('Get all short links error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get metadata for a shortcode
// Get metadata + statistics for a shortcode
router.get('/:shortcode', async (req, res) => {
  try {
    const { shortcode } = req.params;
    const days = parseInt(req.query.days, 10) || 7;

    const data = await linkQueries.getStatsForShortcode(shortcode, days);
    if (!data) return res.status(404).json({ error: 'Not found' });

    // Normalize daily trend: ensure entries for each day in range
    const since = new Date(Date.now() - (days - 1) * 86400000);
    const dailyMap = {};
    data.stats.daily.forEach(r => {
      dailyMap[r.date.toISOString().slice(0,10)] = r.clicks;
    });

    const daily = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since.getTime() + i * 86400000);
      const key = d.toISOString().slice(0,10);
      daily.push({ date: key, clicks: dailyMap[key] || 0 });
    }

    res.json({
      shortcode: data.link.shortcode,
      shortUrl: `${req.protocol}://${req.get('host')}/${data.link.shortcode}`,
      target_url: data.link.target_url,
      total_clicks: data.link.total_clicks,
      last_clicked: data.link.last_clicked,
      created_at: data.link.created_at,
      stats: {
        daily,
        referrers: data.stats.referrers,
        locations: data.stats.locations,
        devices: data.stats.devices,
      },
    });
  } catch (err) {
    console.error('Get short metadata error', err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
