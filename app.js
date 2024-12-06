const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const validator = require("validator");
const errorHandler = require("./middleware/errorHandler");
const { validateLogin, validateSignup } = require("./middleware/validation");

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

app.post("/signin", validateLogin, login);
app.post("/signup", validateSignup, createUser);

app.use("/", routes);

app.use(errors()); // celebrate error handler

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
