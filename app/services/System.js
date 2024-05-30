"use strict";

const fs = require("fs");

class System {
  static storeBase64Image = async ({ base64, type, path = "uploads" }) => {
    if (type === "image/jpeg" || type === "image/jpg") {
      type = "jpg";
    } else if (type === "image/png") {
      type = "png";
    } else {
      return null;
    }

    const { v4: uuidv4 } = require("uuid");
    const filename = uuidv4() + "." + type;
    const filePath = path + "/" + filename;
    const buffer = Buffer.from(base64, "base64");

    fs.writeFileSync(filePath, buffer);

    return filename;
  };
}

module.exports = System;
