const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
const validator = require("validator");
const errorHandler = require("./middleware/errorHandler");

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

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", routes);

app.use(errors()); // celebrate error handler

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
