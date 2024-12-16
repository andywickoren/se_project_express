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
router.delete("/:itemId", validateId("itemId"), auth, deleteItem);
router.put("/:itemId/likes", validateId("itemId"), auth, likeItem);
router.delete("/:itemId/likes", validateId("itemId"), auth, dislikeItem);

module.exports = router;
