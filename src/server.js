const stoppable = require('stoppable'); //for graceful server shutdown

const logger = require('./logger');
const app = require('./app');
const port = parseInt(process.env.PORT || 8080, 10);

const server = stoppable(
  app.listen(port, () => {
    logger.info({ port }, `Server started`);
  })
);

module.exports = server;
