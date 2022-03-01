const mongoose = require('mongoose');

const database = require('../database');
const utils = require('../utils');

jest.mock('mongoose');

describe('DatabaseDriver connect method', () => {
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
