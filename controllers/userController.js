const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/index');
const store = require('../store/memoryStore');
const { verifyRefreshToken } = require('../middleware/tokenChecker');
const { tokens } = require('../config/index');

module.exports = Object.freeze({
  loginUser,
  refreshToken,
  logoutUser,
});

async function loginUser(req, res) {
  if (Object.keys(req.body).length !== 0) {
    try {
      const user = await db.getUserByLogin({ login: req.body.login });
      if (!user) {
        res.status(404).send('Sorry, that user does not appear to exist!');
      } else {
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          res.status(401).send('Password is invalid!');
        } else {
          const generatedAccessToken = _generateAccessToken(user.id, user.role);
          const generatedRefreshToken = _generateRefreshToken(user.id, user.role);
          store.saveRefreshTokenToMemoryStore(generatedRefreshToken, user.id);
          res.status(200).send({
            token: generatedAccessToken, refreshToken: generatedRefreshToken,
          });
        }
      }
    } catch (e) {
      res.status(500).send('There was an error with login!');
    }
  } else {
    res.status(400).send('There was an no request data!');
  }
}

async function refreshToken(req, res) {
  let payload;
  try {
    payload = verifyRefreshToken(req);
  } catch (e) {
    return res.status(403).send({ error: e.message });
  }
  try {
    const token = store.getRefreshTokenFromMemoryStore(payload.id);
    if (token) {
      const newToken = _generateAccessToken(payload.id, payload.role);
      res.status(200).send({ token: newToken, refreshToken: token });
    }
    res.status(401).send('Refresh token is not valid!');
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function logoutUser(req, res) {
  let payload;
  try {
    payload = verifyRefreshToken(req);
    const token = store.getRefreshTokenFromMemoryStore(payload.id);
    if (!token) {
      return res.status(401).send('Refresh token is not valid!');
    }
  } catch (e) {
    return res.status(403).send({ error: e.message });
  }
  try {
    store.deleteRefreshTokenFromMemoryStore(payload.id);
    res.status(200).send('Success log out!');
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

function _generateAccessToken(userId, userRole) {
  return jwt.sign({ id: userId, role: userRole }, tokens.accessToken.secret, {
    algorithm: 'HS256',
    expiresIn: tokens.accessToken.lifetime,
  });
}

function _generateRefreshToken(userId, userRole) {
  return jwt.sign({ id: userId, role: userRole }, tokens.refreshToken.secret, {
    algorithm: 'HS256',
    expiresIn: tokens.refreshToken.lifetime,
  });
}
