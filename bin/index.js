#!/usr/bin/env node

/**
 * basic-blog
 * Copyright (c) 2022 Zack Young
 * MIT Licensed
 */

const fs = require('fs');

const utils = require('../lib/utils');

let app;
let database;
let settings;

const configFileData = `module.exports = {
  databaseDriver: 'mongo',
  // WARNING: Keep secretKey and secretPepper secret!
  secretKey: '${utils.createRandomSecret()}',
  secretPepper: '${utils.createRandomSecret()}',
};`;
const port = 3000;

switch (process.argv[2]) {
  case 'init':
    fs.writeFileSync('../config/development.js', configFileData);
    break;
  case 'run':
    app = require('../app');
    database = require('../lib/database');
    settings = require('../config');

    settings.initializeSettings(() => {
      if (settings.databaseUri) {
        database.connect(settings.databaseSettings);
      }
      app.listen(port, () => {
        console.log(`Listening on port ${port}...`); // eslint-disable-line
      });
    });
    break;
  default:
    console.error('Unrecognized command');
    break;
}
