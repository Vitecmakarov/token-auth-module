const userController = require('./controllers/userController');
const actionsController = require('./controllers/actionsController');
const { verifyUser } = require('./middleware/tokenChecker');

module.exports = Object.freeze({
  init,
  changePasswordRoute,
  createUserRoute,
  deleteUserRoute,
  basicRoutes,
  adminAccessRoutes,
  userAccessRoutes,
});

let app;

function init(express) {
  if (!express) {
    console.log('No express module, you must pass it as a parameter!');
  }
  app = express;
  actionsController.createAdmin().then(() => {
    console.log('Auth module was successfully init!');
  }).catch((e) => {
    console.log(e);
  });
}

function createUserRoute(route) {
  app.post(route, verifyUser.bind(['Admin']), actionsController.createAccount);
}

function deleteUserRoute(route) {
  app.post(route, verifyUser.bind(['Admin']), actionsController.deleteAccount);
}

function changePasswordRoute(route) {
  app.post(route, verifyUser.bind(['Admin', 'User']), actionsController.updatePassword);
}

function basicRoutes(loginRoute, logoutRoute, refreshTokenRoute) {
  app.post(loginRoute, userController.loginUser);
  app.post(logoutRoute, userController.logoutUser);
  app.post(refreshTokenRoute, userController.refreshToken);
}

// If some routes should have access rights for a specific role

function adminAccessRoutes(method, listeners) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [route, fn] of Object.entries(listeners)) {
    app[method](route, verifyUser.bind(['Admin']), fn);
  }
}

function userAccessRoutes(method, listeners) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [route, fn] of Object.entries(listeners)) {
    app[method](route, verifyUser.bind(['User']), fn);
  }
}
