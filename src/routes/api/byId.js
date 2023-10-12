const { readFragment, readFragmentData } = require('../../model/data/memory/memory');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

// Gets a fragment based on its id
module.exports = async (req, res) => {
    const fragmentMetadata = await readFragment(req.user, req.params.id);

    if (fragmentMetadata) {
      const fragmentData = await readFragmentData(req.user, req.params.id);
  
      res.setHeader('Content-Type', fragmentMetadata.type);
      res.setHeader('Content-Length', fragmentMetadata.size);
  
      res.status(200).send(fragmentData);
    } else {
      logger.warn(`Requested fragment does not exist in the memory.`);
      logger.debug(`Fragment not found with ID ${req.params.id}`);
      
      res.status(404).json(createErrorResponse(404, `Fragment not found: ${req.params.id}`));
    }
};
