const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  validateClothingItemBody,
  validateId,
} = require("../middleware/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", validateClothingItemBody, auth, createItem);
router.get("/", getItems);
router.delete("/:itemId", validateId, auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", validateId, auth, dislikeItem);

module.exports = router;
