const db = require('./config/DbConfig');

async function main() {
  const client = await db.pool.connect();
  try {
    console.log('Starting DB seed...');
    await client.query('BEGIN');

    const schema = `
    -- Enable UUID generation (required in Aiven Postgres)
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -----------------------------------------------------
    -- USERS TABLE
    -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -----------------------------------------------------
    -- LINKS TABLE
    -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        shortcode VARCHAR(12) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        total_clicks INTEGER DEFAULT 0,
        last_clicked TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
    CREATE INDEX IF NOT EXISTS idx_links_shortcode ON links(shortcode);

    -----------------------------------------------------
    -- DAILY STATS (LAST 7 DAYS)
    -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS stats_daily_clicks (
        id BIGSERIAL PRIMARY KEY,
        link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        clicks INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (link_id, date)
    );

    CREATE INDEX IF NOT EXISTS idx_stats_daily_link ON stats_daily_clicks(link_id);
    CREATE INDEX IF NOT EXISTS idx_stats_daily_date ON stats_daily_clicks(date);

    -----------------------------------------------------
    -- REFERRER STATS
    -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS stats_referrers (
        id BIGSERIAL PRIMARY KEY,
        link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        referrer TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (link_id, referrer)
    );

    CREATE INDEX IF NOT EXISTS idx_stats_referrer_link ON stats_referrers(link_id);

    -----------------------------------------------------
    -- LOCATION STATS
    -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS stats_locations (
        id BIGSERIAL PRIMARY KEY,
        link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        country VARCHAR(100) NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (link_id, country)
    );

    CREATE INDEX IF NOT EXISTS idx_stats_locations_link ON stats_locations(link_id);

    -----------------------------------------------------
    -- DEVICE STATS
    -----------------------------------------------------
    CREATE TABLE IF NOT EXISTS stats_devices (
        id BIGSERIAL PRIMARY KEY,
        link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
        device VARCHAR(50) NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (link_id, device)
    );

    CREATE INDEX IF NOT EXISTS idx_stats_devices_link ON stats_devices(link_id);
    `;

    await client.query(schema);
    await client.query('COMMIT');
    console.log('DB seed completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DB seed failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    // optionally close pool if script is expected to exit
    await db.close();
  }
}

main();
