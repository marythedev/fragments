const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');

const logger = require('./logger');
const pino = require('pino-http')({ logger });
const authenticate = require('./auth');
const { createErrorResponse } = require('./response');

const app = express();

app.use(pino); //logging middleware
app.use(helmet()); //security middleware
app.use(cors()); //access control middleware
app.use(compression()); //optimization middleware

passport.use(authenticate.strategy());
app.use(passport.initialize()); //passport authentication middleware

// Define our routes
app.use('/', require('./routes'));

//Resources Not Found - 404 middleware
app.use((req, res) => {
  logger.warn("Page not found");
  res.status(404).json(createErrorResponse(404, 'Not Found'));
});

//Error-handling middleware to deal with anything else
//eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  //logs server error so we can see what's going on
  if (status > 499) {
    logger.error({ err }, `Error processing request`);
  }

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

module.exports = app;
