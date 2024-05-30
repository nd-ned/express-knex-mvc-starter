"use strict";

const knex = require("../../database/knex");

class Base {
  constructor(table) {
    if (!table) {
      throw new Error("Missing mandatory property table");
    }

    this.table = table;
    this.knex = knex;
    this.columns = [];
  }

  async findById(id, fields = []) {
    if (!id) {
      throw new Error("Missing mandatory property id");
    }

    return knex(this.table)
      .select(fields.length > 0 ? fields : this.columns)
      .where({ id })
      .first();
  }

  async findOne(criteria, fields = []) {
    if (!criteria || typeof criteria !== "object") {
      throw new Error(
        "Missing mandatory property creteria or it is not an object"
      );
    }

    return knex(this.table)
      .select(fields.length > 0 ? fields : this.columns)
      .where(criteria)
      .first();
  }

  async findAll(criteria = {}, fields = []) {
    if (!criteria || typeof criteria !== "object") {
      throw new Error(
        "Missing mandatory property creteria or it is not an object"
      );
    }

    return knex(this.table)
      .select(fields.length > 0 ? fields : this.columns)
      .where(criteria);
  }

  async create(fields) {
    if (!fields || typeof fields !== "object") {
      throw new Error(
        "Missing mandatory property fields or it is not an object"
      );
    }

    const created = await knex(this.table).insert(fields).returning("id");

    if (Array.isArray(created)) {
      return created[0].id;
    }

    return created.id;
  }

  async update(fields, criteria) {
    if (!fields || typeof fields !== "object") {
      throw new Error(
        "Missing mandatory property fields or it is not an object"
      );
    }

    if (!criteria || typeof criteria !== "object") {
      throw new Error(
        "Missing mandatory property creteria or it is not an object"
      );
    }

    return knex(this.table).update(fields).where(criteria);
  }

  async delete(criteria) {
    if (!criteria || typeof criteria !== "object") {
      throw new Error(
        "Missing mandatory property creteria or it is not an object"
      );
    }

    return knex(this.table).del().where(criteria);
  }

  async deleteById(id) {
    if (!id) {
      throw new Error("Missing mandatory property id");
    }

    return knex(this.table).del().where({ id });
  }
}

module.exports = Base;
