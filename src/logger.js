const options = { level: process.env.LOG_LEVEL || 'info' };

// make the logs easier to read in debug mode
if (options.level === 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);
