"use strict";

const fs = require("fs");
const path = require("path");

const generateKeys = require("../scripts/generateKeys");

const loadKeys = () => {
  let privateKey;
  let publicKey;

  try {
    privateKey = fs.readFileSync(
      path.join(__dirname, "../.private.pem"),
      "utf-8"
    );
    publicKey = fs.readFileSync(
      path.join(__dirname, "../.public.pem"),
      "utf-8"
    );
  } catch (e) {
    console.info("\x1b[31m", "Error loading keys", e);
    console.info("\x1b[32m", "Generating new keys...");

    const { privateKey: newPrivateKey, publicKey: newPublicKey } =
      generateKeys();

    privateKey = newPrivateKey;
    publicKey = newPublicKey;
  }

  process.env.PRIVATE_KEY = privateKey;
  process.env.PUBLIC_KEY = publicKey;
};

function initialize() {
  loadKeys();

  console.log(
    "\x1b[34m",
    `Initialization complete! The app is running on port: ${process.env.PORT}`
  );
}

module.exports = {
  initialize,
};
