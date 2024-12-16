const router = require("express").Router();
const NotFoundError = require("../utils/NotFoundError");
const userRouter = require("./users");
const clothingItem = require("./clothingItem");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
