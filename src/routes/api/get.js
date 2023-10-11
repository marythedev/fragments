const { createSuccessResponse } = require('../../response');
const { listFragments } = require('../../model/data/memory/memory');

// Gets a list of fragments for the current user
module.exports = async (req, res) => {
  const ownerId = req.user;
  const fragments = await listFragments(ownerId);

  let data = {
    fragments: fragments
  };

  res.status(200).json(createSuccessResponse(data));
};
