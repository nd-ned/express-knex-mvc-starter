/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("user_roles", function (table) {
    table.string("id", 450).notNullable().primary();
    table.string("name");
  });

  await knex.schema.createTable("user_role_pivot", function (table) {
    table.string("user_id", 450).notNullable();
    table.string("role_id", 450).notNullable();
    table.primary(["user_id", "role_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_role_pivot").dropTable("user_roles");
};
