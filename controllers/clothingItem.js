const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");
const ClothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid input",
          errors: err.errors,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "Internal server error during item creation",
      });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        const error = new Error("User doesn't own item");
        error.name = "Forbidden";
        throw error;
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.name === "Forbidden") {
        return res
          .status(FORBIDDEN)
          .send({ message: "Forbidden: You cannot delete this item" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error liking the item" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error unliking the item" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
