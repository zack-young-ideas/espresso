const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const settings = require('../config');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  created: Date,
  firstName: String,
  lastName: String,
  admin: Boolean,
});
userSchema.methods.validatePassword = function (password, callback) {
  const secretPassword = password + settings.secretPepper;
  bcrypt.compare(secretPassword, this.password, callback);
};

exports.User = mongoose.model('User', userSchema);
