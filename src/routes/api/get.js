const { createSuccessResponse } = require('../../response');
const { listFragments } = require('../../model/data/memory');

// Gets a list of fragments for the current user
module.exports  = async (req, res) => {
  const ownerId = req.user;
  const expand = req.query.expand == '1';
  const fragments = await listFragments(ownerId, expand);

  let data = {
    fragments: fragments
  };

  res.status(200).json(createSuccessResponse(data));
};
