// Routes
const express = require("express");
const router = express.Router();
const Food = require("../model/Food");
const parser = require('../middleware/uploadImage')


// GET all food items
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific food item by ID
router.get("/:id", getFood, (req, res) => {
  res.json(res.food);
});

// POST a new food item
router.post("/", parser.single("image"), async (req, res) => {
  const food = new Food({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    imageUrl: req.file.path,
  });
  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an existing food item
router.patch("/:id", getFood, parser.single("image"), async (req, res) => {
  const allowedFields = ["name", "description", "price", "imageUrl"];

  allowedFields.forEach((field) => {
    if (req.body[field] != null) {
      res.food[field] = req.body[field];
    }
  });

  if (req.file != null) {
    res.food.imageUrl = req.file.path;
  }

  try {
    const updatedFood = await res.food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a food item
router.delete("/:id", getFood, async (req, res) => {
  try {
    await res.food.remove();
    res.json({ message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a specific food item by ID
async function getFood(req, res, next) {
  let food;
  try {
    food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ message: "Cannot find food item" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.food = food;
  next();
}

module.exports = router;
