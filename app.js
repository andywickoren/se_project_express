const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middleware/errorHandler");
const { validateLogin, validateSignup } = require("./middleware/validation");
const { requestLogger, errorLogger } = require("./middleware/logger");
require("dotenv").config();

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

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.post("/signin", validateLogin, login);
app.post("/signup", validateSignup, createUser);

app.use("/", routes);

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
