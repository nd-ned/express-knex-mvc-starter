"use strict";

const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");

class AuthService {
  static generateHash(string) {
    return crypto.createHash("sha256").update(string).digest;
  }

  static verifyPassword(password, hash) {
    const combinedBuffer = Buffer.from(hash, "base64");
    const iterationCount = parseInt(
      combinedBuffer.slice(0, 5).toString("utf-8")
    );
    const salt = combinedBuffer.slice(5, 21);
    const derivedKey = combinedBuffer.slice(21);

    const derivedKeyToCompare = crypto.pbkdf2Sync(
      password,
      salt,
      iterationCount,
      derivedKey.length,
      "sha256"
    );

    return crypto.timingSafeEqual(derivedKey, derivedKeyToCompare);
  }

  static hashPassword(password) {
    const salt = crypto.randomBytes(16);

    const derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha256");

    const combinedBuffer = Buffer.concat([
      Buffer.from("10000", "utf-8"),
      salt,
      derivedKey,
    ]);

    const encodedHash = combinedBuffer.toString("base64");

    return encodedHash;
  }

  static generateJWTToken(payload) {
    let exp = 3600;

    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY is not defined");
    }

    if (process.env.JWT_EXPIRATION) {
      exp = parseInt(process.env.JWT_EXPIRATION);
    }

    payload.exp = Math.floor(Date.now()) + exp * 1000;
    payload.iat = Math.floor(Date.now());

    return {
      token: jsonwebtoken.sign(payload, process.env.PRIVATE_KEY, {
        algorithm: "RS256",
      }),
      payload,
    };
  }

  static decodeJWT(token) {
    if (!process.env.PUBLIC_KEY) {
      throw new Error("PUBLIC_KEY is not defined");
    }

    if (!token) {
      throw new Error("Token is not defined");
    }

    return jsonwebtoken.verify(token, process.env.PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
  }
}

module.exports = AuthService;
