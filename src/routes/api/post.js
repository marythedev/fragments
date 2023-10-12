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
        const { type } = contentType.parse(req);
        const ownerId = req.user;
        const fragment = new Fragment({ ownerId, type });
        await fragment.save();
        await fragment.setData(req.body);
        
        logger.info(`Created fragment: ${JSON.stringify(fragment)} `);
        
        let data = {
            fragment: fragment
        };

        const url = process.env.API_URL || `http://${req.headers.host}`;
        const location = new URL(`/v1/fragments/${fragment.id}`, url);
        res.setHeader('Location', location.href);

        res.status(201).json(createSuccessResponse(data));
    }

};
