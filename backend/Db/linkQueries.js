const db = require('../config/DbConfig');

async function findByShortcode(shortcode) {
  const res = await db.query('SELECT * FROM links WHERE shortcode = $1 LIMIT 1', [shortcode]);
  return res.rows[0] || null;
}

async function createLink(userId, shortcode, targetUrl) {
  const res = await db.query(
    `INSERT INTO links (user_id, shortcode, target_url)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, shortcode, target_url, total_clicks, last_clicked, created_at`,
    [userId, shortcode, targetUrl]
  );
  return res.rows[0];
}

async function incrementClicks(shortcode) {
  const res = await db.query(
    `UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW()
     WHERE shortcode = $1 RETURNING total_clicks`,
    [shortcode]
  );
  return res.rows[0] || null;
}

async function findAllShortLinks() {
  const res = await db.query('SELECT shortcode, target_url, total_clicks, last_clicked FROM links ORDER BY created_at DESC');
  return res.rows;
}

async function findByUserId(userId) {
  const res = await db.query('SELECT shortcode, target_url, total_clicks, last_clicked FROM links WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

async function getStatsForShortcode(shortcode, days = 7) {
  // find link id first
  const link = await findByShortcode(shortcode);
  if (!link) return null;
  const linkId = link.id;

  // daily clicks for last `days` days
  const dailyRes = await db.query(
    `SELECT date, clicks FROM stats_daily_clicks WHERE link_id = $1 AND date >= CURRENT_DATE - ($2 - 1) ORDER BY date ASC`,
    [linkId, days]
  );

  // referrers
  const refRes = await db.query(
    `SELECT referrer, clicks FROM stats_referrers WHERE link_id = $1 ORDER BY clicks DESC LIMIT 50`,
    [linkId]
  );

  // locations
  const locRes = await db.query(
    `SELECT country, clicks FROM stats_locations WHERE link_id = $1 ORDER BY clicks DESC LIMIT 50`,
    [linkId]
  );

  // devices
  const devRes = await db.query(
    `SELECT device, clicks FROM stats_devices WHERE link_id = $1 ORDER BY clicks DESC LIMIT 20`,
    [linkId]
  );

  return {
    link: {
      id: link.id,
      shortcode: link.shortcode,
      target_url: link.target_url,
      total_clicks: link.total_clicks,
      last_clicked: link.last_clicked,
      created_at: link.created_at,
    },
    stats: {
      daily: dailyRes.rows,
      referrers: refRes.rows,
      locations: locRes.rows,
      devices: devRes.rows,
    },
  };
}

async function deleteByShortcode(userId, shortcode) {
  // Use a transaction so we remove the link and all related statistics atomically.
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // If userId is provided, delete only that user's link. Otherwise delete by shortcode only.
    let delRes
    delRes = await client.query(
      `DELETE FROM links WHERE shortcode = $1 RETURNING id`,
      [shortcode]
    );
    

    const row = delRes.rows[0] || null;
    if (!row) {
      await client.query('ROLLBACK');
      return null;
    }

    const linkId = row.id;

    // Delete related statistics records for this link
    await client.query('DELETE FROM stats_daily_clicks WHERE link_id = $1', [linkId]);
    await client.query('DELETE FROM stats_referrers WHERE link_id = $1', [linkId]);
    await client.query('DELETE FROM stats_locations WHERE link_id = $1', [linkId]);
    await client.query('DELETE FROM stats_devices WHERE link_id = $1', [linkId]);

    await client.query('COMMIT');
    return row;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  findByShortcode,
  createLink,
  incrementClicks,
  findAllShortLinks,
  findByUserId,
  getStatsForShortcode,
  deleteByShortcode,
};
