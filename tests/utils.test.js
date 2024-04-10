const { writeFile } = require('node:fs/promises');
path = require('node:path');

const { getMongoConnectionUri, Settings } = require('../lib/utils');

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn(() => null),
}));

describe('Settings class', () => {
  describe('constructor method', () => {
    it('should import settings given the name of a settings file', () => {
      const filename = path.join(__dirname, '../config/sampleConfig.js');
      const settings = new Settings(filename);

      expect(settings.secretKey).toBe('secret_key');
      expect(settings.secretPepper).toBe('secret_pepper');
      expect(settings.database.name).toBe('database_name');
      expect(settings.database.driver).toBe('database_driver');
      expect(settings.database.username).toBe('username');
      expect(settings.database.password).toBe('password');
      expect(settings.database.host).toBe('localhost:27017');
    });

    it('should use default settings if settings file fails', () => {
      const settings = new Settings('not_a_real_file.js');

      expect(settings.secretKey).toBeTruthy();
      expect(settings.secretPepper).toBeTruthy();
      expect(settings.database.name).toBeNull();
      expect(settings.database.driver).toBe('mongo');
      expect(settings.database.username).toBeNull();
      expect(settings.database.password).toBeNull();
      expect(settings.database.host).toBeNull();
    });
  });

  describe('write method', () => {
    beforeEach(() => {
      writeFile.mockClear();
    });

    it('should write settings to settings file on disk', () => {
      const filename = path.join(__dirname, '../config/sampleConfig.js');
      const settings = new Settings(filename);
      const newSettings = {
        database: {
          name: 'new_name',
          driver: 'new_driver',
          username: 'new_username',
          password: 'new_password',
          host: 'new_host',
        },
        secretKey: 'new_secret_key',
        secretPepper: 'new_secret_pepper',
      };

      expect(writeFile).toHaveBeenCalledTimes(0);

      // Assign new values to the properties of the settings obect.
      Object.assign(settings, newSettings);
      settings.write();

      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile.mock.calls[0][0]).toBe(filename);

      let fileContents = 'module.exports = {\n';
      fileContents += '  database: {\n';
      fileContents += `    name: '${newSettings.database.name}',\n`;
      fileContents += `    driver: '${newSettings.database.driver}',\n`;
      fileContents += `    username: '${newSettings.database.username}',\n`;
      fileContents += `    password: '${newSettings.database.password}',\n`;
      fileContents += `    host: '${newSettings.database.host}',\n`;
      fileContents += '  },\n';
      fileContents += '  // WARNING: Keep secretKey and secretPepper secret!';
      fileContents += '\n';
      fileContents += `  secretKey: '${newSettings.secretKey}',\n`;
      fileContents += `  secretPepper: '${newSettings.secretPepper}',\n`;
      fileContents += '};';

      expect(writeFile.mock.calls[0][1]).toBe(fileContents);
    });
  });

  describe('updateDatabase method', () => {
    it('should update database settings in settings file', () => {
      const settings = new Settings();
      // Mock the write method of the settings object.
      settings.write = jest.fn(() => null);

      expect(settings.write).toHaveBeenCalledTimes(0);

      settings.updateDatabase({
        databaseName: 'new_name',
        username: 'new_user',
        password: 'new_password',
        databaseIp: 'new_IP_address',
        databasePort: 'new_port',
      });

      expect(settings.database.name).toBe('new_name');
      expect(settings.database.driver).toBe('mongo');
      expect(settings.database.username).toBe('new_user');
      expect(settings.database.password).toBe('new_password');
      expect(settings.database.host).toBe('new_IP_address:new_port');
      expect(settings.write).toHaveBeenCalledTimes(1);
    });

    it('should assign a value to the databaseUri property', () => {
      const settings = new Settings();
      // Mock the write method of the settings object.
      settings.write = jest.fn(() => null);
      const formObject = {
        databaseName: 'blog',
        username: 'john_smith',
        password: 'super_secret_password',
        databaseIp: '168.0.1.12',
        databasePort: '27017',
      };

      expect(settings.databaseUri).toBeUndefined();

      settings.updateDatabase(formObject);

      expect(settings.databaseUri).toBe(getMongoConnectionUri(formObject));
    });
  });
});
