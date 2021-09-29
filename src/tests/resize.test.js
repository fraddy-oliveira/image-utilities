const fs = require('fs');
const path = require('path');
const stream = require('stream');

const { unlink } = fs.promises;

const ImageUtilities = require('../ImageUtilities');

describe('Resize image', () => {
  describe('resize image of pixels 1000x1500', () => {
    const source = {
      path: path.resolve(__dirname, './images/Hillary_Goldwynn.jpg'),
      width: 1000,
      height: 1500,
    };

    test('resize to 200x500', async () => {
      //  Arrange
      const dest = {
        path: path.resolve(__dirname, './images/dist/Hillary_Goldwynn.jpg'),
        width: 200,
        height: 500,
      };

      const utilities = new ImageUtilities(source.path, dest.path);

      //  Act
      await utilities.resize(dest.width, dest.height);

      //  Assert

      const verify = await ImageUtilities.metadata(dest.path);

      expect(verify.width).toBe(dest.width);
      expect(verify.height).toBe(dest.height);
    });

    test('resize to 600x400', async () => {
      //  Arrange
      const dest = {
        path: path.resolve(__dirname, './images/dist/Hillary_Goldwynn.jpg'),
        width: 600,
        height: 400,
      };

      const utilities = new ImageUtilities(source.path, dest.path);

      //  Act
      await utilities.resize(dest.width, dest.height);

      //  Assert

      const verify = await ImageUtilities.metadata(dest.path);

      expect(verify.width).toBe(dest.width);
      expect(verify.height).toBe(dest.height);
    });

    test('if dest file does not exists -> create and resize image', async () => {
      //  Arrange
      const dest = {
        path: path.resolve(__dirname, './images/dist/file_does_not_exist.jpg'),
        width: 600,
        height: 400,
      };

      const utilities = new ImageUtilities(source.path, dest.path);

      //  Act
      await utilities.resize(dest.width, dest.height);

      //  Assert
      const verify = await ImageUtilities.metadata(dest.path);

      expect(verify.width).toBe(dest.width);
      expect(verify.height).toBe(dest.height);

      //  Clean up
      expect(await unlink(dest.path)).toBe(undefined);
    });

    test('if dest file dir does not exists -> throw error', async () => {
      //  Arrange
      const dest = {
        path: path.resolve(__dirname, './images/invalid-dir/file_does_not_exist.jpg'),
        width: 600,
        height: 400,
      };

      const utilities = new ImageUtilities(source.path, dest.path);

      try {
        //  Act
        await utilities.resize(dest.width, dest.height);
      } catch (err) {
        //  Assert
        expect(err.message).toMatch(/Image resize transform failed with error/);
      }
    });
  });
});

describe('Resize using transform', () => {
  describe('source is invalid', () => {
    const source = {
      path: path.resolve(__dirname, './images/invalid_stream.jpg'),
      width: 1000,
      height: 1500,
    };

    it('Throw error', async () => {
      //  Arrange
      const destWritable = new stream.Writable();

      try {
        await ImageUtilities.resizeTransformer(source.path, destWritable, {});
      } catch (err) {
        expect(err.message).toMatch('Input source is not readable stream');
      }
    });
  });

  describe('destination is invalid', () => {
    it('Throw error', async () => {
      //  Arrange
      const sourceReadable = new stream.Readable();

      const dest = {
        path: path.resolve(__dirname, './images/dist/invalid_stream.jpg'),
        width: 600,
        height: 400,
      };

      try {
        await ImageUtilities.resizeTransformer(sourceReadable, dest.path, {});
      } catch (err) {
        expect(err.message).toMatch('Destination is not writable stream');
      }
    });
  });
});
