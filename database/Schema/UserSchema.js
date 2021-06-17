'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const required = true;

const Users = mongoose.model('Users', new Schema({
  login: { type: String, required },
  password: { type: String, required },
  role: { type: String, required },
  id: { type: String, required },
}));

module.exports = Object.freeze({
  Users,
});
