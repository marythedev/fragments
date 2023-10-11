const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

// Creates a fragment for the current user
module.exports = async (req, res) => {

    // testing if it was parsed by the raw body parser.
    if (!Buffer.isBuffer(req.body)) 
        res.status(415).json(createErrorResponse(415, "Content-Type is not supported"));
    else {
        const { type } = contentType.parse(req);
        const ownerId = req.user;
        const fragment = new Fragment({ ownerId, type });
        await fragment.save();
        await fragment.setData(req.body);
        let data = {
            fragment: fragment
        };

        const url = process.env.API_URL || `http://${req.headers.host}`;
        const location = new URL(`/v1/fragments/${fragment.id}`, url); 
        res.setHeader('Location', location.href);

        res.status(201).json(createSuccessResponse(data));

    }

};
