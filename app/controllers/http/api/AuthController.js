"use strict";

const { v4: uuidv4 } = require("uuid");

const AspNetUser = require("../../../models/User");
const AuthService = require("../../../services/AuthService");
const Validator = require("../../../services/Validator");
const AspNetRole = require("../../../models/UserRole");
const Family = require("../../../models/Family");
const System = require("../../../services/System");

class AuthController {
  static async checkEmail(req, res, next) {
    try {
      const email = req.body.email;

      if (!email) {
        return res.apiBadRequest("Missing mandatory paramer email");
      }

      if (await AspNetUser.findOne({ email })) {
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

      if (await AspNetUser.findOne({ email: email }, ["Id"])) {
        return res.apiConflict(`email address ${email} already taken!`);
      }

      const PasswordHash = AuthService.hashPassword(password);
      const newUserId = uuidv4();

      await AspNetUser.create({
        id: newUserId,
        email,
        password_hash: PasswordHash,
      });

      const adminRole = await AspNetRole.findOne({ Name: "Admin" }, ["Id"]);

      await AspNetUser.setRole(newUserId, adminRole.Id);

      const names = UserName.split(" ");
      const familyName = names[1] || names[0];

      await Family.create({
        name: familyName,
        owner_id: newUserId,
      });

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

      const user = await AspNetUser.findOne({ email }, [
        "Id",
        "UserName",
        "email",
        "PhoneNumber",
        "AccessFailedCount",
        "PasswordHash",
        "avatar",
      ]);

      if (!user) {
        return res.apiUnauthorized("Invalid email or password!");
      }

      if (!AuthService.verifyPassword(password, user.PasswordHash)) {
        return res.apiUnauthorized("Invalid email or password!");
      }

      delete user.PasswordHash;

      const role = await AspNetUser.getRole(user.Id);

      user.role = role.Name;
      user.isOwner = await Family.isOwner(user.Id);

      const tokenData = AuthService.generateJWTToken({
        Id: user.Id,
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
      const { Id, email } = req.auth.user;
      const tokenData = AuthService.generateJWTToken({ Id, email });

      return res.apiOK("Token refreshed!", tokenData);
    } catch (e) {
      console.error(e);

      next(e);
    }
  }

  static async me(req, res, next) {
    try {
      const { user, decoded } = req.auth;

      user.role = user.role.Name;
      user.isOwner = await Family.isOwner(user.Id);

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
        Id,
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

      if (Id !== user.Id) {
        return res.apiForbidden();
      }

      if (user.email !== email) {
        const newEmailCheck = await AspNetUser.findOne({ email }, ["Id"]);

        if (newEmailCheck) {
          return res.apiConflict(`email ${email} already taken!`);
        }

        uptPayload.email = email;
      }

      if (currentPassword && newPassword) {
        if (AuthService.verifyPassword(currentPassword, user.PasswordHash)) {
          uptPayload.PasswordHash = AuthService.hashPassword(newPassword);
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

      await AspNetUser.update(uptPayload, {
        Id,
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
      const family = await Family.findOne({ owner_id: user.Id }, ["Id"]);

      if (family) {
        await Family.delete(family.Id);
      } else {
        await AspNetUser.deleteById(user.Id);
      }

      return res.apiDeleted();
    } catch (e) {
      console.error(e);

      next(e);
    }
  }
}

module.exports = AuthController;
