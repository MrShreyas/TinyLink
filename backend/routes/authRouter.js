const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Use DB-backed users via queries
const queries = require('../db/queries');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// test DB on load (non-blocking)
const db = require('../config/DbConfig');
db.testConnection().then(() => console.log('Database connection successful')).catch((err) => console.error('Database connection error', err));
// Signup: firstName, lastName, email, password
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email and password are required' });
    }
    // Check existing user in DB
    const existing = await queries.findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const created = await queries.createUser(firstName, lastName, email, hashed);

    res.status(201).json({ user: created });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login: email, password -> sets httpOnly cookie `auth_token`
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const user = await queries.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    // Set cookie; httpOnly for security. In production set `secure: true` when using HTTPS.
    res.cookie('auth_token', token, { httpOnly: true, sameSite: 'lax' });
    req.userId = user.id;

    const safe = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    res.json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout: clears auth_token cookie
router.post('/logout', (req, res, next) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
