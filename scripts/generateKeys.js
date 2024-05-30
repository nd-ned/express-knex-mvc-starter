"use strict";

const crypto = require("crypto");
const fs = require("fs");

const generateKeys = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  fs.writeFileSync(".private.pem", privateKey);
  fs.writeFileSync(".public.pem", publicKey);

  return { privateKey, publicKey };
};

module.exports = generateKeys;
