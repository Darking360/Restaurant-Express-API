var Router = require('express').Router();
var UserController = require('./controller');
const Authorization = require('../utils/roleAuthorization');

module.exports = function (passport) {

  Router.post('/register', UserController.register);

  Router.get('/users', UserController.getUsers);

  Router.delete('/:userId', /*passport.authenticate('jwt', { session: false }),*/ UserController.deleteUserById);

  Router.post('/login', UserController.login(passport));

  Router.patch('/update',
    passport.authenticate('jwt', { session: false }),
    Authorization.roleAuthorization(['user']),
    UserController.updateUserById
  );

  return Router;
}
