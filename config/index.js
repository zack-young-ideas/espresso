const path = require('path');

const utils = require('../lib/utils');

const env = process.env.NODE_ENV || 'development';
let settingsFile;
if (env === 'testing') {
  settingsFile = path.join(__dirname, 'sampleConfig.js');
} else {
  settingsFile = path.join(__dirname, `${env}.js`);
}

module.exports = new utils.Settings(settingsFile);
