const express = require('express');

const UserController = require('./controllers/UserController');
const auth = require('./auth');

const routes = new express.Router();

routes.get('/user', UserController.index);
routes.get('/user/:id', UserController.view);
routes.post('/user', UserController.store);
routes.delete('/user/:id', UserController.delete);
routes.put('/user', auth().authenticate(), UserController.edit);
routes.post('/login', UserController.login);

module.exports = routes;