const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const validator = require("validator");
const errorHandler = require("./middleware/errorHandler");
const { validateLogin, validateSignup } = require("./middleware/validation");
const { requestLogger, errorLogger } = require("./middleware/logger");
require("dotenv").config();

// 35.222.65.16
// ssh andywickoren@35.222.65.16

// module.exports.validateCardBody = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30).messages({
//       "string.min": 'The minimum length of the "name" field is 2',
//       "string.max": 'The maximum length of the "name" field is 30',
//       "string.empty": 'The "name" field must be filled in',
//     }),

//     imageUrl: Joi.string().required().custom(validateURL).messages({
//       "string.empty": 'The "imageUrl" field must be filled in',
//       "string.uri": 'the "imageUrl" field must be a valid url',
//     }),
//   }),
// });

// NTA5MTE5ODk0

const app = express();

const { createUser, login } = require("./controllers/users");
const routes = require("./routes");

const { PORT = 8000 } = process.env;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// app.get("/crash-test", () => {
//   setTimeout(() => {
//     throw new Error("Server will crash now");
//   }, 0);
// });

app.post("/signin", validateLogin, login);
app.post("/signup", validateSignup, createUser);
app.use(requestLogger);

app.use("/", routes);

app.use(errorLogger);
app.use(errors()); // celebrate error handler

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
