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

router.post("/", auth, validateClothingItemBody, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, validateId("itemId"), deleteItem);
router.put("/:itemId/likes", auth, validateId("itemId"), likeItem);
router.delete("/:itemId/likes", auth, validateId("itemId"), dislikeItem);

module.exports = router;
