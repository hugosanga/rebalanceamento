const connection = require('../database/connection')

module.exports = {
    async list(request, response) {
        const { email } = request.params

        const db_connection = connection.connect('admin')
        const users = await db_connection('users')
                                .where('email', email)
                                .select('*')
                                .first()

        if (users) {
            const data = {
                id: users.id,
                name: users.name
            }

            return response.json(data)
        } else {
            return response.json([])
        }
    }
}
