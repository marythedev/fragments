const { readFragment } = require('../../model/data/memory');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

// Gets a fragment based on its id
module.exports = async (req, res) => {
    const fragmentMetadata = await readFragment(req.user, req.params.id);

    if (fragmentMetadata) {
      res.status(200).json(fragmentMetadata);
    } else {
      logger.warn(`Requested fragment does not exist in the memory.`);
      logger.debug(`Fragment not found with ID ${req.params.id}`);
      
      res.status(404).json(createErrorResponse(404, `Fragment not found: ${req.params.id}`));
    }
};
