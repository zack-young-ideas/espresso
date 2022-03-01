const fs = require('fs');

const utils = require('../src/utils');

const env = process.env.NODE_ENV || 'development';

const settings = require(`./${env}.js`);
settings.updateDatabase = async (connectionParams) => {
  /*
  On initial setup, update the settings object with user-provided
  database auth credentials. Write database login credentials to a
  local file for future use.
  */
  const data = JSON.stringify(connectionParams);
  fs.writeFile(`./config/${env}.database.json`, data, (error) => {
    if (!error) {
      if (settings.databaseDriver === 'mongo') {
        settings.databaseUri = utils.getMongoConnectionUri(connectionParams);
      }
    }
  });
};

module.exports = settings;
