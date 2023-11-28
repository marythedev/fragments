const { createSuccessResponse, createErrorResponse } = require('../../response');
const { deleteFragment } = require('../../model/data/memory');
const logger = require('../../logger');

// Delete fragment for the current user
module.exports = async (req, res) => {
    const ownerId = req.user;
    let id = req.params.id;

    try {
        await deleteFragment(ownerId, id);
        res.status(200).json(createSuccessResponse());
    } catch (err) {
        logger.info({ err }, 'Trying to delete fragment that does not exist');
        res.status(404).json(createErrorResponse(404, 'unable to delete fragment'));
    }
};
