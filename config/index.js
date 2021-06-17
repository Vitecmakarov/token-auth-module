const { accessTokenParams, refreshTokenParams } = require('./tokensParams');
const options = require('./main.json');

module.exports = {
  port: process.env.PORT || options.port,
  db: {
    host: process.env.DB_HOST || options.db.host,
    port: process.env.DB_PORT || options.db.port,
    dbName: process.env.DB_NAME || options.db.dbName,
  },
  tokens: {
    accessToken: {
      secret: accessTokenParams.secret,
      lifetime: accessTokenParams.lifetime,
    },
    refreshToken: {
      secret: refreshTokenParams.secret,
      lifetime: refreshTokenParams.lifetime,
    },
  },
  roles: ['Admin', 'User'],
};
