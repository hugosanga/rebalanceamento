const connection = require('../database/connection')
const hash = require('../services/hash')

module.exports = {
    async checkCredentials(request, response) {
        const { email, password } = request.body

        const db_connection = connection.connect('admin')
        const user = await db_connection('users')
                                .where('email', email)
                                .select('*')
                                .first()

        if (user) {

            const { hasedPassword } = hash(password, user.salt)

            if (hasedPassword === user.password) {
                return response.json({ id: user.id, name: user.name })
            }

        }

        return response.json({ error: 'Email ou senha incorretos.'})
    }
}
