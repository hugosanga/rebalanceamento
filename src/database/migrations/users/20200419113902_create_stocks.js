exports.up = function(knex) {
    return knex.schema.createTable('stocks', function(table) {
        table.increments('id')
        table.string('ticker').notNullable()
        table.string('type')
        table.string('sector')
        table.string('subSector')
        table.integer('amount').notNullable()
        table.integer('grade').notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('stocks')
};
