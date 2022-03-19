const getMongoConnectionUri = (connectionParams) => {
  const {
    username,
    password,
    databaseIp,
    databasePort,
    databaseName,
  } = connectionParams;
  const connectionUri = (`mongodb://${username}:${password}`
                         + `@${databaseIp}:${databasePort}`
                         + `/${databaseName}?authSource=admin`);
  return connectionUri;
};

module.exports = { getMongoConnectionUri };
