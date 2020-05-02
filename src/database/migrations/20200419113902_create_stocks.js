exports.up = function(knex) {
    return knex.schema.createTable('stocks', function(table) {
        table.increments('id')
        table.string('ticker').notNullable()
        table.string('type')
        table.string('sector')
        table.string('subSector')
        table.integer('amount').notNullable()
        table.integer('grade').notNullable()

        table.string('user_id').notNullable()
        table.foreign('user_id').references('id').inTable('users')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('stocks')
};
