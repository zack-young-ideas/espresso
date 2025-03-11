const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const settings = require('../config');

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  created: Date,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: {
      values: ['admin'],
      message: '{VALUE} is not a valid user role',
    },
  },
});
userSchema.methods.validatePassword = function(password, callback) {
  const secretPassword = password + settings.secretPepper;
  bcrypt.compare(secretPassword, this.password, callback);
};

exports.User = mongoose.model('User', userSchema);

const date = (dateObject) => dateObject.toLocaleDateString(
  'en-US',
  { year: 'numeric', month: 'long', day: 'numeric' },
);

const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, index: true, unique: true },
  author: String,
  created: { type: Date, get: date },
  modified: { type: Date, get: date },
  image: String,
  body: String,
  published: Boolean,
  tags: [String],
  views: Number,
  comments: [ObjectId],
});
exports.BlogPost = mongoose.model('BlogPost', blogPostSchema);
