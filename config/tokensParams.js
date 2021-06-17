const cryptoRandomString = require('crypto-random-string');

const refreshTokenParams = {
  secret: cryptoRandomString({ length: 100, type: 'base64' }),
  lifetime: 1800,
};
const accessTokenParams = {
  secret: cryptoRandomString({ length: 100, type: 'base64' }),
  lifetime: 86400,
};

module.exports = Object.freeze({
  refreshTokenParams,
  accessTokenParams,
});
