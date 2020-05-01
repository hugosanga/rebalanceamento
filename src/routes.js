const express = require('express')

const UserController = require('./controllers/UserController')
const StockController = require('./controllers/StockController')
const ProfileController = require('./controllers/ProfileController')
const LoginController = require('./controllers/LoginController')

routes = express.Router()

routes.post('/users', UserController.create)
// routes.get('/users', UserController.list)
routes.put('/users/:id', UserController.edit)
routes.delete('/users/:id', UserController.delete)

routes.post('/ticker', StockController.create)
routes.get('/ticker', StockController.list)
routes.put('/ticker/:id', StockController.edit)
routes.delete('/ticker/:id', StockController.delete)

routes.get('/profile/:email', ProfileController.list)

routes.post('/login', LoginController.checkCredentials)

module.exports = routes
