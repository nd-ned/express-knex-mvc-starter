"use strict";

const Base = require("./Base");

class AspNetRole extends Base {
  constructor() {
    super("AspNetRoles");

    this.columns = ["id", "name"];
  }
}

module.exports = new AspNetRole();
