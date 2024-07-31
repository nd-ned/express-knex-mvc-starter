"use strict";

const Base = require("./Base");

class UserRole extends Base {
  constructor() {
    super("user_roles");

    this.columns = ["id", "name"];
  }
}

module.exports = new UserRole();
