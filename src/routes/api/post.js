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

        const ownerId = req.user;
        let { type, parameters } = contentType.parse(req);
        if (parameters && parameters.charset == "utf-8")
            type += "; charset=utf-8";

        let fragment = new Fragment({ ownerId, type });
        fragment.updateSize(req.body);
        await fragment.setData(req.body);
        await fragment.save();

        const url = `http://${req.headers.host}` || process.env.API_URL;
        const location = new URL(`/v1/fragments/${fragment.id}`, url);
        res.setHeader('Location', location.href);
        res.setHeader('Content-Type', type);

        logger.info(`Created fragment: ${JSON.stringify(fragment)} `);

        res.status(201).json(createSuccessResponse({ fragment: fragment }));
    }

};