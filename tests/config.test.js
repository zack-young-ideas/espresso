const fs = require('fs');

const settings = require('../config/index');
const utils = require('../lib/utils');

jest.mock('fs');

describe('settings object', () => {
  describe('updateDatabase() method', () => {
    beforeEach(() => {
      fs.writeFile.mockClear();
    });

    it('should define databaseUri property', async () => {
      const testData = {
        username: 'Steve',
        password: 'Supersecret',
        databaseIp: '127.0.0.1',
        databasePort: '3000',
        databaseName: 'test',
      };
      const connectionString = utils.getMongoConnectionUri(testData);
      fs.writeFile = jest.fn((filename, data, callback) => {
        callback(null);
      });

      expect(
        Object.prototype.hasOwnProperty.call(settings, 'databaseUri'),
      ).toBe(false);

      settings.updateDatabase(testData);

      expect(settings.databaseUri).toBe(connectionString);
    });

    it('should write database.json file', async () => {
      const testData = {
        username: 'Steve',
        password: 'Supersecret',
        databaseIp: '127.0.0.1',
        databasePort: '3000',
        databaseName: 'test',
      };
      const filename = 'development.database.json';

      expect(fs.writeFile).toHaveBeenCalledTimes(0);

      settings.updateDatabase(testData);

      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      const firstArg = fs.writeFile.mock.calls[0][0].split('/');
      expect(firstArg[firstArg.length - 1]).toBe(filename);
      expect(fs.writeFile.mock.calls[0][1]).toBe(JSON.stringify(testData));
    });
  });

  describe('completeSetup() method', () => {
    it('should write to database.json file', async () => {
      const filename = 'development.database.json';
      fs.readFile = jest.fn((fileName, callback) => {
        callback(null, '{}');
      });
      fs.writeFile = jest.fn((fileName, data, callback) => {
        callback(null, '{}');
      });

      expect(fs.readFile).toHaveBeenCalledTimes(0);
      expect(fs.writeFile).toHaveBeenCalledTimes(0);

      settings.completeSetup();

      expect(fs.readFile).toHaveBeenCalledTimes(1);
      let firstArg = fs.readFile.mock.calls[0][0].split('/');
      expect(firstArg[firstArg.length - 1]).toBe(filename);
      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      firstArg = fs.writeFile.mock.calls[0][0].split('/');
      expect(firstArg[firstArg.length - 1]).toBe(filename);
    });

    it('should update setup property of settings object', async () => {
      settings.setup = false;
      fs.readFile = jest.fn((fileName, callback) => {
        callback(null, '{}');
      });
      fs.writeFile = jest.fn((fileName, data, callback) => {
        callback(null, '{}');
      });

      settings.completeSetup();

      expect(settings.setup).toBe(true);
    });
  });

  describe('initializeSettings() method', () => {
    it('should read from database.json file', async () => {
      const filename = 'development.database.json';
      fs.readFile = jest.fn((fileName, callback) => {
        callback(null, '{}');
      });

      expect(fs.readFile).toHaveBeenCalledTimes(0);

      settings.initializeSettings(jest.fn());

      expect(fs.readFile).toHaveBeenCalledTimes(1);
      const firstArg = fs.readFile.mock.calls[0][0].split('/');
      expect(firstArg[firstArg.length - 1]).toBe(filename);
    });

    it('should update properties of settings object', async () => {
      settings.databaseUri = null;
      settings.setup = false;
      const dataObject = {
        databaseName: 'test',
        username: 'zack',
        password: 'password',
        databaseIp: '127.0.0.1',
        databasePort: '27017',
        setup: true,
      };
      fs.readFile = jest.fn((fileName, callback) => {
        callback(null, JSON.stringify(dataObject));
      });

      settings.initializeSettings(jest.fn());

      expect(settings.databaseUri)
        .toBe(utils.getMongoConnectionUri(dataObject));
      expect(settings.setup).toBe(true);
    });
  });
});
