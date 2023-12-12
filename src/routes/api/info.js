const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

// Gets a fragment based on its id
module.exports = async (req, res) => {
  try {
    let fragment = await Fragment.byId(req.user, req.params.id);

    logger.info("Provided information about fragment with id " + req.params.id);
    res.status(200).json(createSuccessResponse({ fragment: fragment }));
  }
  catch (err) {
    logger.warn(`Requested fragment does not exist in the memory.`);
    logger.debug(`Fragment not found with ID ${req.params.id}`);
    res.status(404).json(createErrorResponse(404, `Fragment not found: ${req.params.id}`));
  }
};
