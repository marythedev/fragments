// Gets a list of fragments for the current user
module.exports = (req, res) => {
  // TODO: this is not properly implemented for now (gives a blank list)
  res.status(200).json({
    status: 'ok',
    fragments: [],
  });
};
