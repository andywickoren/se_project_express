const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  OK,
} = require("../utils/errors");
const ClothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(NO_CONTENT).send({}))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem", err });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId, // Find the clothing item by its ID
    { $addToSet: { likes: req.user._id } }, // Add the user's ID to the 'likes' array if it's not already there
    { new: true } // Return the updated document after the update
  )
    .then((item) => res.status(OK).send({ data: item })) // Send back the updated item
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error liking the item", err })
    ); // Handle errors
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId, // Find the clothing item by its ID
    { $pull: { likes: req.user._id } }, // Remove the user's ID from the 'likes' array
    { new: true } // Return the updated document after the update
  )
    .then((item) => res.status(OK).send({ data: item })) // Send back the updated item
    .catch((err) =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error unliking the item", err })
    ); // Handle errors
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};