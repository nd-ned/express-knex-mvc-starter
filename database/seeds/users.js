exports.seed = function (knex) {
  return knex("table_name")
    .del()
    .then(function () {
      return knex("table_name").insert([{ id: 1, username: "nedko" }]);
    });
};
