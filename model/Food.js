const mongoose = require("mongoose");

const menuItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
imageUrl: { type: String, required: true },
});

const Food = mongoose.model("MenuItem", menuItem);

module.exports = Food;
