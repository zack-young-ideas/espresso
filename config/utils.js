/**
 * Defines a class used to construct settings objects.
 */

class Settings {
  constructor(settingsFilename) {
    let fileSettings;
    try {
      fileSettings = require(settingsFilename);
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
}

module.exports = Settings;
