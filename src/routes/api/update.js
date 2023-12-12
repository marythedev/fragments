const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');

// Creates a fragment for the current user
module.exports = async (req, res) => {

    // testing if fragment was parsed by the raw body parser.
    if (!Buffer.isBuffer(req.body)) {
        logger.warn("Fragment could not be parsed by the raw body parser. Invalid Content-Type.");
        res.status(415).json(createErrorResponse(415, "Content-Type is not supported"));
    }
    else {

        const id = req.params.id;
        const ownerId = req.user;
        let { type, parameters } = contentType.parse(req);
        if (parameters && parameters.charset == "utf-8")
            type += "; charset=utf-8";

        try {
            let fragment = await Fragment.byId(ownerId, id);
            if (fragment.type == type) {
                fragment.updateSize(req.body);
                await fragment.setData(req.body);
                await fragment.save();

                logger.info(`Updated fragment with id ${id} `);

                res.setHeader('Content-Type', type);
                res.status(200).json(createSuccessResponse({ fragment: fragment }));
            } else {
                logger.warn(`Trying to update fragment with data of a different type.`);
                res.status(400).json(createErrorResponse(400, `Unsuccessful update of fragment (${id}). Fragment's type cannot be changed after creation, only the content can be changed.`));
            }
        }
        catch (err) {
            logger.warn(`Cannot update fragment with id ${id} as it is not found.`);
            res.status(404).json(createErrorResponse(404, `Fragment with id ${id} not found.`));
        }
    }
};