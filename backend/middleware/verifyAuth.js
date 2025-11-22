const jwt = require('jsonwebtoken');
const queries = require('../Db/queries');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Express middleware to verify auth_token cookie, ensure user exists,
// and attach `req.user = { id, email, first_name, last_name }`.
module.exports = async function verifyAuth(req, res, next) {
  try {
    const token = req.cookies && req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Prefer id if present, otherwise use email
    let user = null;
    if (payload.id) {
      user = await queries.getUserById(payload.id);
    } else if (payload.email) {
      user = await queries.findUserByEmail(payload.email);
    }

    if (!user) return res.status(401).json({ error: 'User not found' });

    // Attach minimal user info to request
    req.user = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
