const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "67169c75cd383b669aa51f9e",
  };
  next();
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
