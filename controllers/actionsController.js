const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const db = require('../database/index');
const { roles } = require('../config/index');

module.exports = Object.freeze({
  createAccount,
  deleteAccount,
  updatePassword,
  createAdmin,
});

async function createAdmin() {
  try {
    const user = await db.getUserByRole({ role: 'Admin' });
    if (!user) {
      const login = 'Admin';
      const password = bcrypt.hashSync('Admin', 10);
      const role = 'Admin';
      const uniqId = uuid.v4();
      await db.createUser({
        login,
        password,
        role,
        uniqId,
      });
      console.log('Admin successfully created!');
    }
  } catch (e) {
    console.log(e);
  }
}

async function createAccount(req, res) {
  if (Object.keys(req.body).length === 0) {
    try {
      const payload = _decodeAccessToken(req);
      if (!roles.includes(req.body.role) || (payload.role === req.body.role) || (payload.role === 'User')) {
        res.status(403).send('No permissions to do this!');
      }
      const user = await db.getUserByLogin({ login: req.body.login });
      if (user) {
        res.status(409).send('User with current name is already exist!');
      } else {
        const { login, role } = req.body;
        const password = bcrypt.hashSync(req.body.password, 10);
        const uniqId = uuid.v4();
        await db.createUser({
          login,
          password,
          role,
          uniqId,
        });
        res.status(200).send('Successes created!');
      }
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  } else {
    res.status(400).send('There was an no request data!');
  }
}

async function deleteAccount(req, res) {
  if (Object.keys(req.body).length === 0) {
    let payload;
    try {
      payload = _decodeAccessToken(req);
    } catch (e) {
      res.status(403).send({ error: e.message });
    }
    if (req.body.id) {
      try {
        const user = await db.getUserById({ id: req.body.id });
        if ((payload.role === user.role) || (payload.role === 'User')) {
          res.status(403).send('No permissions to do this!');
        }
        await db.deleteUserById({ id: req.body.id });
        res.status(200).send('Successes deleted!');
      } catch (e) {
        res.status(500).send({ error: e.message });
      }
    }
  } else {
    res.status(400).send('There was an no request data!');
  }
}

async function updatePassword(req, res) {
  if (Object.keys(req.body).length === 0) {
    let payload;
    try {
      payload = _decodeAccessToken(req);
    } catch (e) {
      return res.status(403).send({ error: e.message });
    }
    if (req.body.id) {
      try {
        const user = await db.getUserById({ id: req.body.id });
        if ((payload.role === user.role) || (payload.role === 'User')) {
          res.status(403).send('No permissions to do this!');
        }
        const password = bcrypt.hashSync(req.body.password, 10);
        await db.updateUserById({ id: req.body.id }, { password });
        res.status(200).send('Password updated!');
      } catch (e) {
        res.status(500).send({ error: e.message });
      }
    }
  } else {
    res.status(400).send('There was an no request data!');
  }
}

function _decodeAccessToken(req) {
  let accessToken = req.headers.authorization;
  accessToken = accessToken.replace('Bearer', '').trim();
  try {
    return jwt.decode(accessToken);
  } catch (e) {
    throw new Error(e);
  }
}
