const db = require('../config/DbConfig');

async function recordClick(linkId, { referrer = 'Direct', country = null, device = 'Unknown' } = {}) {
  // Normalize values to avoid NOT NULL constraint violations
  const safeCountry = country || 'Unknown';
  const safeReferrer = referrer || 'Direct';
  const safeDevice = device || 'Unknown';

  // Run inserts/updates in parallel; best-effort (non-blocking from caller)
  const dailyQ = db.query(
    `INSERT INTO stats_daily_clicks (link_id, date, clicks)
     VALUES ($1, CURRENT_DATE, 1)
     ON CONFLICT (link_id, date) DO UPDATE SET clicks = stats_daily_clicks.clicks + 1`,
    [linkId]
  );

  const refQ = db.query(
    `INSERT INTO stats_referrers (link_id, referrer, clicks)
     VALUES ($1, $2, 1)
     ON CONFLICT (link_id, referrer) DO UPDATE SET clicks = stats_referrers.clicks + 1`,
    [linkId, safeReferrer]
  );

  const locQ = db.query(
    `INSERT INTO stats_locations (link_id, country, clicks)
     VALUES ($1, $2, 1)
     ON CONFLICT (link_id, country) DO UPDATE SET clicks = stats_locations.clicks + 1`,
    [linkId, safeCountry]
  );

  const devQ = db.query(
    `INSERT INTO stats_devices (link_id, device, clicks)
     VALUES ($1, $2, 1)
     ON CONFLICT (link_id, device) DO UPDATE SET clicks = stats_devices.clicks + 1`,
    [linkId, safeDevice]
  );

  return Promise.all([dailyQ, refQ, locQ, devQ]);
}

module.exports = {
  recordClick,
};
