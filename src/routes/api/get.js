const { createSuccessResponse } = require('../../response');

// Gets a list of fragments for the current user
module.exports = (req, res) => {
  // TODO: this is not properly implemented for now (gives a blank list)

  let data = {
    fragments: [],
  };

  res.status(200).json(createSuccessResponse(data));
};
