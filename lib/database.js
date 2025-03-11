const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const models = require('./models');
const settings = require('../config');
const utils = require('./utils');

const connect = async (connectionUri) => {
  await mongoose.connect(
    connectionUri,
    { serverSelectionTimeoutMS: 5000 },
  );
};

const createUser = async (data) => {
  const hash = bcrypt.hashSync(data.password + settings.secretPepper, 10);
  if (hash) {
    const newUser = new models.User({
      username: data.username,
      password: hash,
      email: data.email,
      created: new Date(),
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    });
    await newUser.save();
    return newUser;
  }
  throw new Error('Unable to create user');
};

const getUsers = async () => models.User.find({});

const getUserByUsername = async (username, password, callback) => {
  let user;
  try {
    user = await models.User.findOne({ username });
  } catch (error) {
    return callback(
      null,
      false,
      { message: 'Incorrect username or password' },
    );
  }
  if (!user) {
    return callback(
      null,
      false,
      { message: 'Incorrect username or password' },
    );
  }
  user.validatePassword(password, (err, result) => {
    if (err) {
      return callback(err);
    } if (!result) {
      return callback(
        null,
        false,
        { message: 'Incorrect username or password' },
      );
    }
    return callback(null, user);
  });
};

const createBlogPost = async (data) => {
  const publishStatus = (data.action === 'Publish');
  const newPost = new models.BlogPost({
    title: data.title,
    slug: data.slug,
    author: 'Admin',
    created: new Date(),
    modified: new Date(),
    image: data.image,
    body: data.body,
    published: publishStatus,
    tags: data.tags,
    views: 0,
    comments: [],
  });
  await newPost.save();
};

const updateBlogPost = async (data) => {
  const filter = { slug: data.slug };
  const update = {
    title: data.title,
    author: 'Admin',
    modified: new Date(),
    body: data.body,
    tags: data.tags,
  };
  await models.BlogPost.findOneAndUpdate(filter, update);
};

const getBlogPosts = async () => models.BlogPost.find({});

const getPublishedBlogPosts = async () => (
  models.BlogPost.find({ published: true })
);

const getBlogPostBySlug = async (slug) => models.BlogPost.findOne({ slug });

module.exports = {
  connect,
  createUser,
  getUsers,
  getUserByUsername,
  createBlogPost,
  getBlogPosts,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
};
