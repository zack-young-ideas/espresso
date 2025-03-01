const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const settings = require('../config');
const database = require('../lib/database');
const models = require('../lib/models');
const utils = require('../lib/utils');

jest.mock('bcrypt');
jest.mock('../lib/models');
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');

  return {
    ...originalModule,
    connect: jest.fn(),
  };
});

describe('database driver connect() method', () => {
  it('should call mongoose.connect() method', async () => {
    const connectionString = ('mongodb://username:password@'
                              + 'localhost:27017/database_name'
                              + '?authSource=admin');

    expect(mongoose.connect).toHaveBeenCalledTimes(0);

    await database.connect(connectionString);

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(
      connectionString,
      { serverSelectionTimeoutMS: 5000 },
    );
  });
});

describe('database driver createUser() method', () => {
  let testData;
  let userObject;

  beforeEach(() => {
    testData = {
      username: 'Steve',
      password: 'Supersecret',
      email: 'steve@example.com',
      firstName: 'Steve',
      lastName: 'O',
      role: 'admin',
    };
    bcrypt.hashSync = jest.fn(() => 's0m3H4sh');
    userObject = { save: jest.fn() };
    models.User = jest.fn(() => userObject);
  });

  it('should call bcrypt.hash() method', async () => {
    expect(bcrypt.hashSync).toHaveBeenCalledTimes(0);

    await database.createUser(testData);

    expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(
      `Supersecret${settings.secretPepper}`,
      10,
    );
  });

  it('should create a new User object', async () => {
    expect(models.User).toHaveBeenCalledTimes(0);

    await database.createUser(testData);

    expect(models.User).toHaveBeenCalledTimes(1);
    expect(userObject.save).toHaveBeenCalledTimes(1);
  });
});

describe('database driver getUserByUsername() method', () => {
  it('should call models.User.findOne() method', async () => {
    models.User.findOne = jest.fn();

    expect(models.User.findOne).toHaveBeenCalledTimes(0);

    await database.getUserByUsername('Steve', 'password', () => null);

    expect(models.User.findOne).toHaveBeenCalledTimes(1);
    expect(models.User.findOne.mock.calls[0][0].username).toBe('Steve');
  });
});

describe('database driver createBlogPost() method', () => {
  it('should construct a new BlogPost object', async () => {
    const blogPostObject = { save: jest.fn() };
    models.BlogPost = jest.fn(() => blogPostObject);
    const blogPostData = {
      title: 'Test Post',
      slug: 'test-post',
      body: 'Lorem ipsum...',
      tags: ['test'],
      action: 'Publish',
    };

    expect(models.BlogPost).toHaveBeenCalledTimes(0);

    await database.createBlogPost(blogPostData);

    expect(models.BlogPost).toHaveBeenCalledTimes(1);
    expect(blogPostObject.save).toHaveBeenCalledTimes(1);
  });
});
