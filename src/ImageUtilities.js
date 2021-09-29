const fs = require('fs');
const stream = require('stream');
const util = require('util');

const sharp = require('sharp');

const pipelineAsync = util.promisify(stream.pipeline);

class ImageUtilities {
  constructor(src = '', dest = '') {
    if (typeof src !== 'string') {
      throw new Error('source path needs to be string');
    } else if (src.trim() === '') {
      throw new Error('source path is required');
    }

    this.src = src;

    this.dest = dest;
  }

  async resize(width, height, options) {
    //  @TODO : research on default resize option.
    let resizeOptions = {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    };

    resizeOptions = { ...resizeOptions, ...options };

    resizeOptions.width = width || options.width;

    resizeOptions.height = height || options.height;

    let readableStream;
    let writableStream;

    try {
      readableStream = fs.createReadStream(this.src);
    } catch (err) {
      throw new Error(`Failed to create readable stream from ${this.src}`);
    }

    try {
      writableStream = !ImageUtilities.isStream(this.dest)
        ? fs.createWriteStream(this.dest) : this.dest;
    } catch (err) {
      throw new Error(`Failed to create writable stream from ${this.dest}`);
    }

    return ImageUtilities.resizeTransformer(readableStream, writableStream, resizeOptions);
  }

  static async resizeTransformer(readableStream = null, writableStream = null, resizeOptions) {
    if (!ImageUtilities.isStream(readableStream)) {
      throw new Error('Input source is not readable stream');
    }

    if (!ImageUtilities.isStream(writableStream)) {
      throw new Error('Input source is not writable stream');
    }

    const transformer = sharp().resize(resizeOptions);

    try {
      await pipelineAsync(
        readableStream,
        transformer,
        writableStream,
      );
    } catch (err) {
      throw new Error(`Image resize transform failed with error: ${err.name}`);
    }

    return true;
  }

  static isStream(input) {
    //    @TODO : research if other stream check needs to be included
    return !!(input instanceof stream.Writable || input instanceof stream.Readable);
  }
}

module.exports = ImageUtilities;
