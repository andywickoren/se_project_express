const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// error-handler.js
// const {
//   BadRequestError,
//   UnauthorizedError,
//   ForbiddenError,
//   NotFoundError,
//   ConflictError,
// } = require("../utils/errors");

const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnathorizedError");
const ForbiddenError = require("../utils/ForbiddenError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof ConflictError
  ) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(500).send({ message: "Internal Server Error" });
};

module.exports = errorHandler;
