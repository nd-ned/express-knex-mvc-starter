"use strict";

const express = require("express");

const router = express.Router();
const AuthController = require("../controllers/http/api/AuthController");
const { requiresAuthAndVerification } = require("../middlewares/auth/Handler");

router.post("/check/email", AuthController.checkEmail);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/refresh", [
  requiresAuthAndVerification,
  AuthController.refreshToken,
]);

router.get("/me", [requiresAuthAndVerification, AuthController.me]);
router.put("/me", [requiresAuthAndVerification, AuthController.updateMe]);
router.delete("/me", [requiresAuthAndVerification, AuthController.deleteMe]);

module.exports = router;
