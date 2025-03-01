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
  // Used to read and write app settings to a local file on disk.
  constructor(settingsFilename) {
    this.setup = false;
    this.filename = settingsFilename;
    const defaultSettings = {
      database: {
        name: null,
        driver: 'mongo',
        username: null,
        password: null,
        host: null,
      },
      secretKey: createRandomSecret(),
      secretPepper: createRandomSecret(),
    };
    if (this.filename) {
      try {
        const fileSettings = require(settingsFilename); // eslint-disable-line
        Object.assign(this, fileSettings);
      } catch (error) {
        Object.assign(this, defaultSettings);
      }
    } else {
      Object.assign(this, defaultSettings);
    }
  }

  get databaseUri() {
    /*
    Returns the connection string for connecting to the database.
    */
    const [databaseIp, databasePort] = this.database.host.split(':');
    return getMongoConnectionUri({
      username: this.database.username,
      password: this.database.password,
      databaseIp: databaseIp,
      databasePort: databasePort,
      databaseName: this.database.name,
    });
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

  updateDatabase(formObject) {
    const newDatabaseObject = {
      ...this.database,
      name: formObject.databaseName,
      username: formObject.username,
      password: formObject.password,
      host: `${formObject.databaseIp}:${formObject.databasePort}`,
    };
    this.database = newDatabaseObject;
    return this.write();
  }
}

module.exports = { createRandomSecret, getMongoConnectionUri, Settings };
