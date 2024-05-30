"use strict";

const express = require("express");

const authRouter = require("./auth");

const router = express.Router();
const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

router.use("/api", apiRouter);

module.exports = router;
