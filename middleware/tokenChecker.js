const jwt = require('jsonwebtoken');
const { tokens } = require('../config/index');

module.exports = Object.freeze({
  verifyUser,
  verifyRefreshToken,
});

function verifyUser(req, res, next) {
  const role = this;
  const payload = _verifyToken(req, res);
  if (payload && payload.role) {
    if (role.includes(payload.role)) {
      next();
    } else {
      res.status(403).send('Has no permission to use this resource!');
    }
  }
}

function verifyRefreshToken(req) {
  // eslint-disable-next-line no-shadow
  let refreshToken = req.headers.authorization;
  if (!refreshToken) {
    throw new Error('No token was provided!');
  }
  refreshToken = refreshToken.replace('Bearer', '').trim();
  try {
    return jwt.verify(refreshToken, tokens.refreshToken.secret);
  } catch (e) {
    throw new Error('Not verified!');
  }
}

function _verifyToken(req, res) {
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(403).send('Not access token!');
  }
  accessToken = accessToken.replace('Bearer', '').trim();
  try {
    return jwt.verify(accessToken, tokens.accessToken.secret);
  } catch (e) {
    res.status(403).send('Not verified!');
  }
}
