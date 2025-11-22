const db = require('../config/DbConfig');

async function findUserByEmail(email) {
  const res = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [String(email).toLowerCase()]);
  return res.rows[0] || null;
}

async function createUser(firstName, lastName, email, passwordHash) {
  const res = await db.query(
    `INSERT INTO users (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, first_name, last_name, email, created_at, updated_at`,
    [firstName, lastName, String(email).toLowerCase(), passwordHash]
  );
  return res.rows[0];
}

async function getUserById(id) {
  const res = await db.query('SELECT id, first_name, last_name, email, created_at, updated_at FROM users WHERE id = $1 LIMIT 1', [id]);
  return res.rows[0] || null;
}

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
};
