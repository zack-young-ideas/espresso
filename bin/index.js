#!/usr/bin/env node

/**
 * basic-blog
 * Copyright (c) 2022 Zack Young
 * MIT Licensed
 */

const fs = require('fs');
const path = require('path');

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
const filename = path.join(__dirname, '..', 'config', 'development.js');
const port = 3000;

const command = process.argv[2];
switch (command) {
  case 'init':
    fs.writeFileSync(filename, configFileData);
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
    console.error(`InvalidCommandError: Unrecognized command '${command}'`);
    break;
}
