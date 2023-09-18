//Main entry-point for the v1 version of the fragments API.
const express = require('express');
const router = express.Router();

// GET /v1/fragments
router.get('/fragments', require('./get'));

module.exports = router;
