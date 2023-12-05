const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const { writeFragment, writeFragmentData } = require('../../model/data');
const logger = require('../../logger');

// Creates a fragment for the current user
module.exports = async (req, res) => {

    // testing if fragment was parsed by the raw body parser.
    if (!Buffer.isBuffer(req.body)) {
        logger.warn("Fragment could not be parsed by the raw body parser. Invalid Content-Type.");
        res.status(415).json(createErrorResponse(415, "Content-Type is not supported"));
    }
    else {
        let { type, parameters } = contentType.parse(req);

        if (parameters && parameters.charset == "utf-8") 
            type += "; charset=utf-8";

        const ownerId = req.user;
        const fragment = new Fragment({ ownerId, type });
        fragment.updateSize(req.body);
        if (process.env.AWS_REGION)        //save dates as strings when storing with AWS
            fragment.convertDatestoDateString();
        await writeFragment(fragment);
        await writeFragmentData(ownerId, fragment.id, req.body);

        logger.info(`Created fragment: ${JSON.stringify(fragment)} `);
        
        let data = {
            fragment: fragment
        };

        const url = `http://${req.headers.host}` || process.env.API_URL;
        const location = new URL(`/v1/fragments/${fragment.id}`, url);
        res.setHeader('Location', location.href);

        res.status(201).json(createSuccessResponse(data));
    }

};
