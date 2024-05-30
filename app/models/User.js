"use strict";

const UserRole = require("./UserRole");
const Base = require("./Base");

class User extends Base {
  constructor() {
    super("User");

    this.columns = ["id", "email", "password_hash"];
  }

  async getRole(userId) {
    return await UserRole.knex
      .select(["r.Name", "r.id"])
      .from("UserRole as r")
      .innerJoin("user_role_pivot as ur", "r.id", "ur.role_id")
      .where("ur.user_id", userId)
      .first();
  }

  async setRole(userId, roleId) {
    return await UserRole.knex("user_role_pivot").insert({
      user_id: userId,
      role_id: roleId,
    });
  }

  async removeRole(userId, roleId) {
    return await UserRole.knex("user_role_pivot")
      .where({ user_id: userId, role_id: roleId })
      .del();
  }

  async updateRole(userId, roleId) {
    return await UserRole.knex("user_role_pivot")
      .where({ user_id: userId })
      .update({ role_id: roleId });
  }

  async findInIds(ids, fields = []) {
    return await this.knex
      .select(fields.length > 0 ? fields : this.columns)
      .from(this.table)
      .whereIn("id", ids);
  }

  async deleteInIds(ids) {
    return await this.knex(this.table).whereIn("id", ids).del();
  }
}

module.exports = new User();
