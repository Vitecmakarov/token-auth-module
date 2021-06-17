'use strict';

const usersRefreshTokens = {};

module.exports = Object.freeze({
  saveRefreshTokenToMemoryStore,
  deleteRefreshTokenFromMemoryStore,
  getRefreshTokenFromMemoryStore,
});

function saveRefreshTokenToMemoryStore(token, userId) {
  usersRefreshTokens[userId] = token;
}

function deleteRefreshTokenFromMemoryStore(userId) {
  delete usersRefreshTokens[userId];
}

function getRefreshTokenFromMemoryStore(userId) {
  return usersRefreshTokens[userId];
}
