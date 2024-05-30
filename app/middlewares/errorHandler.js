"use strict";

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const [type, message] = err.message.split("::: ");
  let debug = null;

  if (process.env.NODE_ENV === "development") {
    debug = err.stack;
  }

  switch (type) {
    case "Internal Server Error":
      res.status(500).json({
        code: 500,
        type,
        message,
        debug,
      });
      break;
    case "Bad Request":
      res.status(400).json({
        code: 400,
        type,
        message,
        debug,
      });
      break;
    default:
      console.error("Unexpected error!");
      console.error(err.message, err);
      // todo send notification

      res.status(500).json({
        code: 500,
        type: "Internal Server Error",
        message: "Something went wrong, please try again later!",
        debug,
      });
  }
};
