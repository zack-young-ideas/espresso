#!/usr/bin/env node

/**
 * basic-blog
 * Copyright (c) 2022 Zack Young
 * MIT Licensed
 */

const fs = require('fs');
const path = require('path');

const sass = require('sass');
const webpack = require('webpack');

const app = require('../app');
const database = require('../lib/database');
const settings = require('../config');
const utils = require('../lib/utils');
const webpackConfig = require('./webpack.config.js');

const port = 3000;

const command = process.argv[2];
switch (command) {
  case 'init': {
    // Initilize the settings file for the website.
    const configFileData = `module.exports = {
      databaseDriver: 'mongo',
      // WARNING: Keep secretKey and secretPepper secret!
      secretKey: '${utils.createRandomSecret()}',
      secretPepper: '${utils.createRandomSecret()}',
    };`;
    const configFilename = path.join(__dirname, '../config/development.js');
    fs.writeFileSync(configFilename, configFileData);

    // Compile the site's sole stylesheet from SASS files.
    if (!fs.existsSync(path.resolve(__dirname, '../public'))) {
      fs.mkdirSync(path.resolve(__dirname, '../public'));
    }
    const sassFilename = path.join(__dirname, '../public/styles.css');
    const sassOutput = sass.compile('./src/sass_files/main.scss');
    fs.writeFileSync(sassFilename, sassOutput.css);

    // Use Webpack to compile the site's frontend JavaScript files.
    webpack(webpackConfig, (err) => {
      if (err) {
        console.error(err.stack || err);
      }
    });
    break;
  }
  case 'run': {

    if (settings.databaseUri) {
      database.connect(settings.databaseSettings);
    }
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
    break;
  }
  default: {
    console.error(`InvalidCommandError: Unrecognized command '${command}'`);
    break;
  }
}
