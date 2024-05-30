"use strict";

const AuthService = require("../../services/AuthService");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    let bearer = null,
      user = null,
      decoded = null;

    if (authHeader) {
      bearer = authHeader.replace("Bearer ", "");
    }

    if (bearer) {
      try {
        decoded = AuthService.decodeJWT(bearer);
      } catch (e) {
        console.error("Error decoding bearer", e);
      }
    }

    req.auth = {
      bearer,
      decoded,
      user,
    };

    next();
  } catch (e) {
    console.error("auth middleware error", e);
    next(e);
  }
};
