/**
 * Defines a class used to construct settings objects.
 */

const { writeFile } = require('node:fs/promises');

const utils = require('../lib/utils');

class Settings {
  constructor(settingsFilename) {
    this.filename = settingsFilename;
    let fileSettings;
    try {
      fileSettings = require(settingsFilename); // eslint-disable-line
      Object.assign(this, fileSettings);
    } catch (error) {
      this.database = {
        name: null,
        driver: 'mongo',
        username: null,
        password: null,
        host: null,
      };
      this.secretKey = utils.createRandomSecret();
      this.secretPepper = utils.createRandomSecret();
    }
  }

  write() {
    let output = 'module.exports = {\n';
    output += '  database: {\n';
    output += `    name: '${this.database.name}',\n`;
    output += `    driver: '${this.database.driver}',\n`;
    output += `    username: '${this.database.username}',\n`;
    output += `    password: '${this.database.password}',\n`;
    output += `    host: '${this.database.host}',\n`;
    output += '  },\n';
    output += '  // WARNING: Keep secretKey and secretPepper secret!\n';
    output += `  secretKey: '${this.secretKey}',\n`;
    output += `  secretPepper: '${this.secretPepper}',\n`;
    output += '};';
    return writeFile(this.filename, output, { encoding: 'utf8' });
  }
}

module.exports = Settings;
