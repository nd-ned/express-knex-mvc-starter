exports.up = async function (knex) {
  return await knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("email");
    table.string("password_hash");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
