const connection = require('../database/connection')
const crypto = require('crypto')
const fs = require('fs')

module.exports = {
    async create(request, response) {
        const { name, email, password, salt } = request.body

        const id = crypto.randomBytes(10).toString('HEX')

        await connection('users')
                .insert({
                    id,
                    name,
                    email,
                    password,
                    salt
                })

        return response.json({ name })
    },

    async list(request, response) {
        const users = await connection('users')
                                .select('*')

        return response.json(users)
    },

    async delete(request, response) {
        const { id } = request.params

        const status = await connection('users')
                                .where('id', id)
                                .delete()

        await connection('stocks')
                .where('user_id', id)
                .delete()

        response.json({ status })
    },

    async edit(request, response) {
        const { name, email } = request.body
        const { id } = request.params

        const status = await connection('users')
                                .where('id', id)
                                .update('name', name)
                                .update('email', email)

        response.json({ status })
    }
}
