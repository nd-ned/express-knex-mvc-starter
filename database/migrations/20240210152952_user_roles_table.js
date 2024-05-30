/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("user_roles", function (table) {
    table.increments("id").primary();
    table.string("name");
  });

  await knex.schema.createTable("user_role_pivot", function (table) {
    table.increments("id").primary();

    table.integer("user_id").unsigned().notNullable();
    table.integer("role_id").unsigned().notNullable();

    table.foreign("user_id").references("id").inTable("users");
    table.foreign("role_id").references("id").inTable("user_roles");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_role_pivot").dropTable("user_roles");
};
