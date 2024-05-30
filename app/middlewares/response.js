"use strict";

const parameterUndefinedErr = (parameter) => {
  throw new Error(
    `Internal Server Error::: Missing mandatory response parameter "${parameter}"!`
  );
};

module.exports = (req, res, next) => {
  res.apiOK = (message, data, meta) => {
    if (!message) {
      parameterUndefinedErr("message");
    } else if (!data) {
      parameterUndefinedErr("data");
    }

    const resObj = {
      code: 200,
      type: "OK",
      message,
      data,
    };

    if (meta) {
      resObj.meta = meta;
    }

    res.status(200).json(resObj);
  };

  res.apiCreated = (message, data) => {
    if (!message) {
      parameterUndefinedErr("message");
    } else if (!data) {
      parameterUndefinedErr("data");
    }

    res.status(201).json({
      code: 201,
      type: "Created",
      message,
      data,
    });
  };

  res.apiAccepted = (message) => {
    res.status(202).json({
      code: 202,
      type: "Accepted",
      message,
    });
  };

  res.apiUpdated = () => {
    res.status(204).send();
  };

  res.apiDeleted = () => {
    res.status(204).send();
  };

  res.apiBadRequest = (message) => {
    if (!message) {
      parameterUndefinedErr("message");
    }

    res.status(400).json({
      code: 400,
      type: "Bad Request",
      message,
    });
  };

  res.apiUnauthorized = (message) => {
    if (!message) {
      parameterUndefinedErr("message");
    }

    res.status(401).json({
      code: 401,
      type: "Unauthorized",
      message,
    });
  };

  res.apiPaymentRequired = (message) => {
    res.status(402).json({
      code: 402,
      type: "Payment Required",
      message: message || "402 Payment Required",
    });
  };

  res.apiForbidden = (message) => {
    res.status(403).json({
      code: 403,
      type: "Forbidden",
      message: message || "403 Forbidden",
    });
  };

  res.apiNotFound = (message) => {
    if (!message) {
      parameterUndefinedErr("message");
    }

    res.status(404).json({
      code: 404,
      type: "Not Found",
      message,
    });
  };

  res.apiConflict = (message) => {
    if (!message) {
      parameterUndefinedErr("message");
    }

    res.status(409).json({
      code: 409,
      type: "Conflict",
      message,
    });
  };

  res.apiUnprocessableEntity = (message) => {
    if (!message) {
      parameterUndefinedErr("message");
    }

    res.status(422).json({
      code: 422,
      type: "Unprocessable Entity",
      message,
    });
  };

  next();
};
