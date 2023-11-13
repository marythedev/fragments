const { readFragment, readFragmentData } = require('../../model/data/memory/memory');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
var MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

// Gets a fragment based on its id
module.exports = async (req, res) => {
  let id = req.params.id;
  if (id.includes('.')) {
    id = req.params.id.split('.')[0];
    var ext = req.params.id.split('.')[1];
  }

  const fragmentMetadata = await readFragment(req.user, id);

  if (fragmentMetadata) {
    let fragmentData = await readFragmentData(req.user, id);

    res.setHeader('Content-Type', fragmentMetadata.type);
    res.setHeader('Content-Length', fragmentMetadata.size);

    if (fragmentMetadata.type == 'text/plain'
      || fragmentMetadata.type == 'text/markdown'
      || fragmentMetadata.type == 'text/html') {

      console.log('Got user fragment data', { fragmentData });

      if (ext) {
        //fragmentData = Buffer.from(fragmentData);
        //fragmentData = fragmentData.toString('utf8');
        fragmentData = convert(res, fragmentMetadata, fragmentData, ext);
      }

      res.status(200).send(fragmentData);
    }

    else if (fragmentMetadata.type == 'application/json') {
      fragmentData = Buffer.from(fragmentData);
      fragmentData = fragmentData.toString('utf8');
      console.log('Got user fragment data', fragmentData);

      if (ext)
        fragmentData = convert(res, fragmentMetadata, fragmentData, ext);

      res.status(200).json(fragmentData);
    }

  } else {
    logger.warn(`Requested fragment does not exist in the memory.`);
    logger.debug(`Fragment not found with ID ${id}`);

    res.status(404).json(createErrorResponse(404, `Fragment not found: ${id}`));
  }
};

//convert fragment data to selected type if possible
const convert = (res, metadata, data, ext) => {

  //determine extention type
  let convertTo;
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
    convertTo = 'image/jpg';
  else if (ext == 'jpeg')
    convertTo = 'image/jpeg';
  else if (ext == 'webp')
    convertTo = 'image/webp';
  else if (ext == 'gif')
    convertTo = 'image/gif';


  //determine possible conversion
  let possibleConversions;
  if (metadata.type == 'text/plain')
    possibleConversions = ['text/plain'];
  else if (metadata.type == 'text/markdown')
    possibleConversions = ['text/markdown', 'text/html', 'text/plain'];
  else if (metadata.type == 'text/html')
    possibleConversions = ['text/html', 'text/plain'];
  else if (metadata.type == 'application/json')
    possibleConversions = ['application/json', 'text/plain'];

  /* Formats are not supported yet:
  else if (metadata.type == 'image/png')
    possibleConversions = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  else if (metadata.type == 'image/jpeg')
    possibleConversions = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  else if (metadata.type == 'image/webp')
    possibleConversions = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  else if (metadata.type == 'image/gif')
    possibleConversions = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];  
  */

  //determine if conversion is possible
  let conversionIsPossible = false;
  possibleConversions.map((conversion) => {
    if (conversion == convertTo)
      conversionIsPossible = true;
  });

  //convert if possible
  if (conversionIsPossible) {

    if (metadata.type == "text/markdown") {

      if (convertTo == "text/html") {
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

    return data;
  } else {
    logger.warn(`Requested conversion is not possible.`);
    logger.debug(`Fragment of type ${metadata.type} cannot be converted to ${convertTo}.`);

    res.status(415).json(createErrorResponse(415, `Fragment cannot be converted to selected type.`));
  }

}