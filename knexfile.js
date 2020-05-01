// Update with your config settings.

module.exports = {

    development(db) {
        return {
            client: 'sqlite3',
            connection: {
                filename: `./src/database/${db === 'admin' ? 'admin' : db}.sqlite`
            },
            migrations: {
                directory: `./src/database/migrations/${db === 'admin' ? 'admin' : 'users'}`
            },
            useNullAsDefault: true
        }
    },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
