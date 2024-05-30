"use strict";

const AspNetUser = require("../../models/User");

class Handler {
  static async requireAuth(req, res, next) {
    try {
      const { decoded } = req.auth;

      if (decoded?.exp < new Date().getTime()) {
        return res.apiUnauthorized("Token expired!");
      }

      if (!decoded?.id) {
        return res.apiUnauthorized("Invalid token!");
      }

      const user = await AspNetUser.findOne({ id: decoded.id });

      if (!user) {
        return res.apiUnauthorized("Token expired!");
      }

      const role = await AspNetUser.getRole(decoded.id);

      user.role = role;

      req.auth.user = user;
    } catch (e) {
      console.error("auth middleware error", e);
      return res.apiUnauthorized("Invalid token!");
    }

    next();
  }

  static async requiresAuthAndVerification(req, res, next) {
    Handler.requireAuth(req, res, function () {
      // TODO: add verification
      next();
    });
  }

  static async onlyOwnerAccess(req, res, next) {
    Handler.requireAuth(req, res, function () {
      if (req.auth.user && req.auth.user.id !== parseInt(req.params.user_id)) {
        return res.apiForbidden();
      }

      next();
    });
  }

  static allowAdminAccess(req, res, next) {}
}

module.exports = Handler;
