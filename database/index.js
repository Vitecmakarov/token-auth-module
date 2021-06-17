const { Users } = require('./Schema/UserSchema');

module.exports = Object.freeze({
  getUserById,
  getUserByLogin,
  getUserByRole,
  createUser,
  deleteUserById,
  updateUserById,
});

function getUserByRole(role) {
  return Users.findOne(role);
}

function getUserByLogin(login) {
  return Users.findOne(login);
}

function getUserById(id) {
  return Users.findOne(id);
}

function createUser(userData) {
  return Users.create(userData);
}

function deleteUserById(id) {
  return Users.findOneAndDelete(id);
}

function updateUserById(id, updateData) {
  return Users.findOneAndUpdate(id, updateData);
}
