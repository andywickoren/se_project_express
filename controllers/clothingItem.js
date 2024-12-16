const {
  NotFoundError,
  // INTERNAL_SERVER_ERROR,
  ForbiddenError,
  BadRequestError,
} = require("../utils/errors");
const ClothingItem = require("../models/clothingItems");

const createItem = (req, res, next) => {
  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.log("we hit an error");
        next(new BadRequestError("Invalid input"));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(new Error("Error from getItems"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("User doesn't own item");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else if (err instanceof ForbiddenError) {
        next(err);
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
