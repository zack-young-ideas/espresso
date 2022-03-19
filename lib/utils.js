const crypto = require('crypto');

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

module.exports = { createRandomSecret, getMongoConnectionUri };
