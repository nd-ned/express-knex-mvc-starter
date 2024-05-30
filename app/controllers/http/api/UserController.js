"use strict";

const AspNetUser = require("../../../models/AspNetUser");

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await AspNetUser.findAll({});
      return res.apiOK("Users successfully retrieved", users);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}

module.exports = UserController;
