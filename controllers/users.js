const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const User = require("../models/user");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar = "", email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and passsword are required"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      res.send({
        name: user.name,git 
        avatar: user.avatar || "",
        email: user.email,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      if (err.code === 11000) {
        return next(new ConflictError("This email already exists"));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      const { _id, email, avatar, name } = user;
      res.send({
        _id,
        email,

        avatar,
        name,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      const { _id, email } = user;
      res.send({
        _id,
        email,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation failed"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }

      next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
