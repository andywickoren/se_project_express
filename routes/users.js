const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdate } = require("../middleware/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdate, updateUser);
module.exports = router;
