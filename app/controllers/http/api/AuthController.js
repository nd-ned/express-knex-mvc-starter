"use strict";

const User = require("../../../models/User");
const AuthService = require("../../../services/AuthService");
const Validator = require("../../../services/Validator");
const UserRole = require("../../../models/UserRole");
const System = require("../../../services/System");

class AuthController {
  static async checkEmail(req, res, next) {
    try {
      const email = req.body.email;

      if (!email) {
        return res.apiBadRequest("Missing mandatory paramer email");
      }

      if (await User.findOne({ email })) {
        return res.apiConflict(`email ${email} already taken!`);
      }

      return res.apiAccepted("email currently available!");
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async register(req, res, next) {
    try {
      const failed = Validator.checkRequiredFields(req.body, [
        "email",
        "password",
      ]);

      if (failed) {
        return res.apiBadRequest(
          "Missing mandatory paramers: " + failed.join(",")
        );
      }

      const { email, UserName, password } = req.body;

      if (Validator.invalidateEmail(email)) {
        return res.apiUnprocessableEntity(`Invalid email address ${email}!`);
      }

      if (await User.findOne({ email: email }, ["id"])) {
        return res.apiConflict(`email address ${email} already taken!`);
      }

      const password_hash = AuthService.hashPassword(password);
      const newUserId = uuidv4();

      await User.create({
        email,
        password_hash: password_hash,
      });

      const adminRole = await UserRole.findOne({ name: "admin" }, ["id"]);

      await User.setRole(newUserId, adminRole.id);

      return AuthController.login(req, res, next);
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.apiBadRequest(
          "Missing mandatory parameters: email, password"
        );
      }

      const user = await User.findOne({ email }, [
        "id",
        "email",
        "password_hash",
        "avatar",
      ]);

      if (!user) {
        return res.apiUnauthorized("Invalid email or password!");
      }

      if (!AuthService.verifyPassword(password, user.password_hash)) {
        return res.apiUnauthorized("Invalid email or password!");
      }

      delete user.password_hash;

      const role = await User.getRole(user.id);

      user.role = role.name;

      const tokenData = AuthService.generateJWTToken({
        id: user.id,
        email: user.email,
      });

      return res.apiOK("Login successful!", user, tokenData);
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { id, email } = req.auth.user;
      const tokenData = AuthService.generateJWTToken({ id, email });

      return res.apiOK("Token refreshed!", tokenData);
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async me(req, res, next) {
    try {
      const { user, decoded } = req.auth;

      user.role = user.role.name;

      return res.apiOK("User details!", user, decoded);
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async updateMe(req, res, next) {
    try {
      const { user } = req.auth;
      const {
        id,
        UserName,
        email,
        currentPassword,
        newPassword,
        base64avatar,
        avatarType,
      } = req.body;
      const uptPayload = {
        UserName,
      };

      if (id !== user.id) {
        return res.apiForbidden();
      }

      if (user.email !== email) {
        const newEmailCheck = await User.findOne({ email }, ["id"]);

        if (newEmailCheck) {
          return res.apiConflict(`email ${email} already taken!`);
        }

        uptPayload.email = email;
      }

      if (currentPassword && newPassword) {
        if (AuthService.verifyPassword(currentPassword, user.password_hash)) {
          uptPayload.password_hash = AuthService.hashPassword(newPassword);
        } else {
          return res.apiUnauthorized("Invalid current password!");
        }
      }

      if (base64avatar) {
        const filePath = await System.storeBase64Image({
          base64: base64avatar,
          type: avatarType,
        });

        uptPayload.avatar = filePath;
      }

      await User.update(uptPayload, {
        id,
      });

      return res.apiUpdated();
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async deleteMe(req, res, next) {
    try {
      const { user } = req.auth;
      const family = await Family.findOne({ owner_id: user.id }, ["id"]);

      if (family) {
        await Family.delete(family.id);
      } else {
        await User.deleteById(user.id);
      }

      return res.apiDeleted();
    } catch (e) {
      console.error(e);

      next(e);
    }
  }
}

module.exports = AuthController;
