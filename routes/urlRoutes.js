const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  redirectToLongUrl,
  getUrlStats,
} = require('../controllers/urlController');

// POST /shorten must come BEFORE GET /:code
router.post('/shorten', createShortUrl);
router.get('/stats/:code', getUrlStats);
router.get('/:code', redirectToLongUrl); // <== This should be the last route

module.exports = router;
