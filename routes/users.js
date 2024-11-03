const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

//new
router.use(auth);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);
module.exports = router;

//old
// const { getUsers, createUser, getUser } = require("../controllers/users");

//old
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
