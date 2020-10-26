
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.bigIncrements()
    table.string('name').notNullable()
    table.string('username').notNullable()
    table.string('email').notNullable()
    table.string('password_hash')

    table.unique(['username', 'email'])
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
