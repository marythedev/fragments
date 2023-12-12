const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// Delete fragment for the current user
module.exports = async (req, res) => {
    const ownerId = req.user;
    let id = req.params.id;

    try {
        await Fragment.delete(ownerId, id);
        logger.info(`Deleted fragment with id ${id} for user ${ownerId}`);
        res.status(200).json(createSuccessResponse());
    } catch (err) {
        logger.warn({ err }, 'Trying to delete fragment that does not exist');
        res.status(404).json(createErrorResponse(404, 'unable to delete fragment'));
    }
};
