
exports.up = function(knex) {
    return knex.schema.createTable('tokens', function(table) {
        table.string('device')
        table.string('access_token').notNullable().index()
        table.string('refresh_token').notNullable().index()
        table.integer('expires_in')
        table.bigInteger('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .index()

        table.timestamps(true, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('tokens')

    
};
