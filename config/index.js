const fs = require('fs');

const utils = require('../src/utils');

const env = process.env.NODE_ENV || 'development';

const settings = require(`./${env}.js`); // eslint-disable-line
settings.setup = false;
settings.updateDatabase = (connectionParams) => {
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

settings.completeSetup = () => {
  /*
  After an admin user is created, update the settings object to
  indicate that the setup process is complete. This ensures that
  all future requests to the setup URLs result in a 404 response.
  */
  let currentSettings;
  fs.readFile(`./config/${env}.database.json`, (error, data) => {
    if (!error) {
      currentSettings = JSON.parse(data);
      currentSettings.setup = true;
      const newSettings = JSON.stringify(currentSettings, null, 2);
      fs.writeFile(
        `./config/${env}.database.json`,
        newSettings,
        (err) => {
          if (!err) {
            settings.setup = true;
          }
        },
      );
    }
  });
};

settings.initializeSettings = (callback) => {
  /*
  If a database.json file exists, initialize the settings object with
  the database credentials from that file.
  */
  fs.readFile(`./config/${env}.database.json`, (error, data) => {
    if (!error) {
      const databaseInfo = JSON.parse(data);
      settings.databaseSettings = databaseInfo;
      settings.databaseUri = utils.getMongoConnectionUri(databaseInfo);
      settings.setup = databaseInfo.setup;
    }
    return callback();
  });
};

module.exports = settings;
