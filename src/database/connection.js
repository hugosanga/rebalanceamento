const knex = require('knex')
const configurations = require('../../knexfile')

module.exports = {
    async create(db) {
        await knex(configurations.development(db)).migrate.latest()
        return true
    },

    connect(db) {
        return knex(configurations.development(db))
    }
}
