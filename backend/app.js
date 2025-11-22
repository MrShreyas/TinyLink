var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authRouter = require('./routes/authRouter');
var shortLinkRouter = require('./routes/shortLinkRouter');
var cors = require('cors');
require('dotenv').config();
const geoip = require('geoip-lite');

var linkQueries = require('./Db/linkQueries');
var analyticsQueries = require('./Db/analyticsQueries');
var verifyAuth = require('./middleware/verifyAuth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Enable CORS for the frontend app and allow credentials (cookies)
app.use(cors({ origin: ['http://localhost:3000','https://tiny-link-eight-eta.vercel.app'], credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/:shortcode', async function(req, res, next) {
  try {
    const sc = req.params.shortcode;
    if (!sc) return next();
    const link = await linkQueries.findByShortcode(sc);
    if (!link) return next();

    // increment clicks (non-blocking)
    linkQueries.incrementClicks(sc).catch(err => console.error('Increment clicks error', err));

    // record analytics (best-effort, non-blocking)
    try {
      const ua = req.get('user-agent') || '';
      const device = /Mobi|Android|iPhone|iPad|Mobile/i.test(ua) ? 'Mobile' : 'Desktop';
      const ref = req.get('referer') || req.get('referrer') || 'Direct';
      const country = req.get('cf-ipcountry') || req.get('x-vercel-ip-country') || null;
      const ip = req.ip; // Express's req.ip will give you the client's IP (after trust proxy if applicable)
        // Perform the geolocation lookup
      const geo = geoip.lookup(ip);
      
      analyticsQueries.recordClick(link.id, { referrer: ref, country: geo ? geo.country : country, device }).catch(err => console.error('Record analytics error', err));
    } catch (e) {
      console.error('Analytics processing error', e);
    }

    return res.redirect(302, link.target_url);
  } catch (err) {
    console.error('Redirect error', err);
    next(err);
  }
});



app.use('/auth', authRouter);
// Protect the short create endpoint: POST /short/create requires auth
app.use('/short', verifyAuth);
app.use('/short', shortLinkRouter);

// Redirect handler for shortcodes at root: /:shortcode -> 302 to target_url


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
