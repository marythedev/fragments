const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
var MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const sharp = require('sharp');

// Gets a fragment based on its id
module.exports = async (req, res) => {
  let id = req.params.id;
  if (id.includes('.')) {
    id = req.params.id.split('.')[0];
    var ext = req.params.id.split('.')[1];
  }
  try {
    const fragment = await Fragment.byId(req.user, id);
    let fragmentData = await fragment.getData();

    if (ext) {
      //determine extention type
      let convertTo = undefined;
      if (ext == 'txt')
        convertTo = 'text/plain';
      else if (ext == 'md')
        convertTo = 'text/markdown';
      else if (ext == 'html')
        convertTo = 'text/html';
      else if (ext == 'json')
        convertTo = 'application/json';
      else if (ext == 'png')
        convertTo = 'image/png';
      else if (ext == 'jpg')
        convertTo = 'image/jpeg';
      else if (ext == 'webp')
        convertTo = 'image/webp';
      else if (ext == 'gif')
        convertTo = 'image/gif';

      if (fragment.formats.includes(convertTo)) {
        const convertedData = await convert(res, fragment, fragmentData, convertTo);

        res.setHeader('Content-Type', convertTo);
        res.setHeader('Content-Length', convertedData.length);
        logger.info(`Retrieved fragment and converted with id ${id} to type ${convertTo} `);
        res.status(200).send(convertedData);
      } else {
        logger.warn("Fragment could not be parsed by the raw body parser. Invalid Content-Type.");
        res.status(415).json(createErrorResponse(415, "Content-Type is not supported"));
      }
    }
    else {
      res.setHeader('Content-Type', fragment.type);
      res.setHeader('Content-Length', fragment.size);
      logger.info(`Retrieved fragment with id ${id} `);
      res.status(200).send(fragmentData);
      return;
    }
  }
  catch (err) {
    logger.warn(`Requested fragment does not exist in the memory.`);
    logger.debug(`Fragment not found with ID ${id}`);
    logger.debug(err);
    res.status(404).json(createErrorResponse(404, `Fragment not found: ${id}`));
    return;
  }
};

//convert fragment data to selected type if possible
const convert = async (res, metadata, data, convertTo) => {

  //determine if conversion possible and make a conversion
  if (metadata.type == "text/markdown") {

    if (convertTo == "text/html") {
      logger.debug(data)
      data = data.toString('utf8');
      data = md.render(data);
    }

    else if (convertTo == "text/plain") {
      data = data.toString('utf8');
      data = md.render(data);
      data = data.replace(/<[^>]*>/g, '');
    }
  }

  else if (metadata.type == "text/html") {
    if (convertTo == "text/plain") {
      data = data.toString('utf8');
      data = data.replace(/<[^>]*>/g, '');
    }
  }

  else if (metadata.type == "application/json") {
    if (convertTo == "text/plain")
      data = JSON.stringify(data);
  }

  else if (metadata.type == "image/png") {
    if (convertTo == "image/jpeg")
      data = await sharp(data).jpeg().toBuffer();
    else if (convertTo == "image/webp")
      data = await sharp(data).webp().toBuffer();
    else if (convertTo == "image/gif")
      data = await sharp(data).gif().toBuffer();
  }

  else if (metadata.type == "image/jpeg") {
    if (convertTo == "image/png")
      data = await sharp(data).png().toBuffer();
    else if (convertTo == "image/webp")
      data = await sharp(data).webp().toBuffer();
    else if (convertTo == "image/gif")
      data = await sharp(data).gif().toBuffer();
  }

  else if (metadata.type == "image/webp") {
    if (convertTo == "image/png")
      data = await sharp(data).png().toBuffer();
    else if (convertTo == "image/jpeg")
      data = await sharp(data).jpeg().toBuffer();
    else if (convertTo == "image/gif")
      data = await sharp(data).gif().toBuffer();
  }

  else if (metadata.type == "image/gif") {
    if (convertTo == "image/png")
      data = await sharp(data).png().toBuffer();
    else if (convertTo == "image/jpeg")
      data = await sharp(data).jpeg().toBuffer();
    else if (convertTo == "image/webp")
      data = await sharp(data).webp().toBuffer();
  }
  return data;

}