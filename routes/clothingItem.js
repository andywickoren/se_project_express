const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItem");

//CRUD

//Create
router.post("/", createItem);

//Read

router.get("/", getItems);

//Update

router.put("/:itemId", updateItem);

//Delete

router.delete("/:itemId", deleteItem);

// Like a clothing item
router.put("/:itemId/likes", likeItem);

// Unlike a clothing item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
