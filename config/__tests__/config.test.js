const fs = require('fs');

const settings = require('../index');
const utils = require('../../src/utils');

jest.mock('fs');

describe('settings object', () => {
  describe('updateDatabase method', () => {
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

      await settings.updateDatabase(testData);

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
      const filename = './config/development.database.json';

      expect(fs.writeFile).toHaveBeenCalledTimes(0);

      await settings.updateDatabase(testData);

      expect(fs.writeFile).toHaveBeenCalledTimes(1);
      expect(fs.writeFile.mock.calls[0][0]).toBe(filename);
      expect(fs.writeFile.mock.calls[0][1]).toBe(JSON.stringify(testData));
    });
  });
});
