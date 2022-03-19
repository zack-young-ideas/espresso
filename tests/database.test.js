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

describe('DatabaseDriver connect() method', () => {
  it('should call mongoose.connect() method', async () => {
    const testData = {
      username: 'Steve',
      password: 'Supersecret',
      databaseName: 'test',
      databaseIp: '127.0.0.1',
      databasePort: '3000',
    };
    const connectionString = utils.getMongoConnectionUri(testData);

    expect(mongoose.connect).toHaveBeenCalledTimes(0);

    await database.connect(testData);

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledWith(
      connectionString,
      { serverSelectionTimeoutMS: 5000 },
    );
  });
});

describe('DatabaseDriver createAdminUser() method', () => {
  let testData;
  let userObject;

  beforeEach(() => {
    testData = {
      username: 'Steve',
      password: 'Supersecret',
      email: 'steve@example.com',
    };
    bcrypt.hashSync = jest.fn(() => 's0m3H4sh');
    userObject = { save: jest.fn() };
    models.User = jest.fn(() => userObject);
  });

  it('should call bcrypt.hash() method', async () => {
    expect(bcrypt.hashSync).toHaveBeenCalledTimes(0);

    await database.createAdminUser(testData);

    expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith(
      `Supersecret${settings.secretPepper}`,
      10,
    );
  });

  it('should create a new User object', async () => {
    expect(models.User).toHaveBeenCalledTimes(0);

    await database.createAdminUser(testData);

    expect(models.User).toHaveBeenCalledTimes(1);
    expect(userObject.save).toHaveBeenCalledTimes(1);
  });
});

describe('DatabaseDriver getUserByUsername() method', () => {
  it('should call models.User.findOne() method', async () => {
    models.User.findOne = jest.fn();

    expect(models.User.findOne).toHaveBeenCalledTimes(0);

    await database.getUserByUsername('Steve', 'password', () => null);

    expect(models.User.findOne).toHaveBeenCalledTimes(1);
    expect(models.User.findOne.mock.calls[0][0].username).toBe('Steve');
  });
});

describe('DatabaseDriver createBlogPost() method', () => {
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
