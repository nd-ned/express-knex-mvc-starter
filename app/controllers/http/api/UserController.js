"use strict";

const User = require("../../../models/User");

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await User.findAll({});
      return res.apiOK("Users successfully retrieved", users);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}

module.exports = UserController;
