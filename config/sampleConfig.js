/**
 * Sample configuration file.
 *
 * This script is used to run tests against the Settings class.
 */

module.exports = {
  database: {
    name: 'database_name',
    driver: 'database_driver',
    username: 'username',
    password: 'password',
    host: 'localhost:27017',
  },
  // WARNING: Keep secretKey and secretPepper secret!
  secretKey: 'secret_key',
  secretPepper: 'secret_pepper',
};
