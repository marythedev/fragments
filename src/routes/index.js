const express = require('express');
const { version, author } = require('../../package.json');
const { authenticate } = require('../auth');
const router = express.Router();

//Expose all of API routes on /v1/* to include an API version.
router.use(`/v1`, authenticate(), require('./api'));

//health check route
router.get('/', (req, res) => {
  //makes sure the response isn't cached
  //https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/marythedev/fragments',
    version,
  });
});

module.exports = router;
