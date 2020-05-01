const connection = require('../database/connection')
const crypto = require('crypto')
const fs = require('fs')

module.exports = {
    async create(request, response) {
        if (!fs.existsSync(__dirname + '/../database/admin.sqlite')) {
            await connection.create('admin')
        }

        const { name, email, password, salt } = request.body

        const id = crypto.randomBytes(10).toString('HEX')

        connection.create(id)
        const db_connection = connection.connect('admin')
        await db_connection('users')
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
        const db_connection = connection.connect('admin')
        const users = await db_connection('users')
                                .select('*')

        return response.json(users)
    },

    async delete(request, response) {
        const { id } = request.params
        const database_path = __dirname + `/../database/${id}.sqlite`

        fs.unlinkSync(database_path)

        const db_connection = connection.connect('admin')
        const status = await db_connection('users')
                                .where('id', id)
                                .delete()

        response.json({ status })
    },

    async edit(request, response) {
        const { name, email } = request.body
        const { id } = request.params

        const db_connection = connection.connect('admin')
        const status = await db_connection('users')
                                .where('id', id)
                                .update('name', name)
                                .update('email', email)

        response.json({ status })
    }
}
