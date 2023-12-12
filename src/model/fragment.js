// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const formats = [
  'text/plain',
  'text/markdown',
  'text/html',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
];

class Fragment {
  constructor({ id = randomUUID(), ownerId, created = new Date().toISOString(), updated = new Date().toISOString(), type, size = 0 }) {
    // check if fragment is even valid
    if (ownerId == undefined) {
      logger.error("Cannot create fragment without ownerId");
      logger.debug(`given ownerId: ${ownerId}`);
      throw new Error('ownerId is required');
    }
    if (type == undefined) {
      logger.error("Cannot create fragment without type");
      logger.debug(`given type: ${type}`);
      throw new Error('type is required');
    } else if (Fragment.isSupportedType(type) != true) {
      logger.error("Cannot create fragment of unsupported type");
      logger.debug(`given type: ${type}`);
      throw new Error('invalid type');
    }
    if (typeof size != 'number') {
      logger.error("Cannot create fragment of non-number size");
      logger.debug(`given size: ${size}`);
      throw new Error('size must be a number');
    } else if (size < 0) {
      logger.error("Cannot create fragment of negative size");
      logger.debug(`given size: ${size}`);
      throw new Error('size cannot be negative');
    }


    //otherwise the fragment is valid and can be created
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const result = await readFragment(ownerId, id);
    if (result == undefined) {
      logger.error(`Fragment wasn't found for the given ownerId and id`);
      logger.debug(`given ownerId: ${ownerId}, id: ${id}`);
      throw new Error('fragment not found');
    }
    else {
      logger.debug("Fragment was found for the given ownerId and id" + id)
      return new Fragment(result);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Updates the fragment's size
   * @param {Buffer} data
   * @returns nothing
   */
  updateSize(data) {
    if (data == undefined)
      this.size = 0;
    else {
      this.updated = new Date().toISOString();
      this.size = data.byteLength;
    }
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (data == undefined) {
      logger.error("Cannot set fragment's data as it is undefined.");
      logger.debug(`given data: ${data}`);
      throw new Error('data is required');
    }
    this.updated = new Date().toISOString();
    this.size = data.byteLength;
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let formats;

    if (this.mimeType == 'text/plain')
      formats = ['text/plain'];
    else if (this.mimeType == 'text/markdown')
      formats = ['text/markdown', 'text/html', 'text/plain'];
    else if (this.mimeType == 'text/html')
      formats = ['text/html', 'text/plain'];
    else if (this.mimeType == 'application/json')
      formats = ['application/json', 'text/plain'];
    else if (this.mimeType == 'image/png' || this.mimeType == 'image/jpeg'
      || this.mimeType == 'image/webp' || this.mimeType == 'image/gif')
      formats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

    return formats;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    for (const format of formats) {
      if (value.startsWith(format))
        return true;
    }
    return false;
  }
}

module.exports.Fragment = Fragment;