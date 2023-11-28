//Main entry-point for the v1 version of the fragments API.
const express = require('express');
const router = express.Router();
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// GET /v1/fragments
router.get('/fragments', require('./get'));

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
router.post('/fragments', rawBody(), require('./post'));

// GET /v1/fragments/:id - get a fragment by id
router.get('/fragments/:id', require('./byId'));

// GET /v1/fragments/:id - get a fragment by id
router.get('/fragments/:id/info', require('./info'));

// DELETE /fragments/:id - delete a fragment by id
router.delete('/fragments/:id', require('./delete'));

module.exports = router;
