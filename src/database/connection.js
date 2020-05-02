const knex = require('knex')
const configurations = require('../../knexfile')

module.exports = knex(configurations.production)
