const { writeFile } = require('node:fs/promises');
const crypto = require('node:crypto');

const createRandomSecret = () => {
  // Generates a cryptographically-secure random string.
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)';
  const secretKey = [];
  while (secretKey.length < 50) {
    const index = crypto.randomInt(0, characters.length);
    secretKey.push(characters[index]);
  }
  return secretKey.join('');
};

const getMongoConnectionUri = (connectionParams) => {
  // Returns a connection string to connect to a MongoDB database.
  const {
    username,
    password,
    databaseIp,
    databasePort,
    databaseName,
  } = connectionParams;
  const connectionUri = (`mongodb://${username}:${password}`
                         + `@${databaseIp}:${databasePort}`
                         + `/${databaseName}?authSource=admin`);
  return connectionUri;
};

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
      this.secretKey = createRandomSecret();
      this.secretPepper = createRandomSecret();
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

module.exports = { createRandomSecret, getMongoConnectionUri, Settings };
