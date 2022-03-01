const mongoose = require('mongoose');

const utils = require('./utils');

const connect = async (data) => {
  await mongoose.connect(
    utils.getMongoConnectionUri(data),
    { serverSelectionTimeoutMS: 5000 },
  );
};

module.exports = { connect };
