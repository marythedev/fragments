const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// Gets a list of fragments for the current user
module.exports = async (req, res) => {
  const ownerId = req.user;
  const expand = req.query.expand == '1';
  const fragments = await Fragment.byUser(ownerId, expand);

  logger.info(`Provided information about fragments for user ${ownerId}`);

  res.status(200).json(createSuccessResponse({ fragments: fragments }));
};