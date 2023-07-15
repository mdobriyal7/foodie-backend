const express = require("express");
const router = express.Router();
const CartItem = require("../model/cartItem");
const MenuItem = require("../model/Food");

// GET all items in the cart
router.get("/", async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate("menuItem");
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an item to the cart or update the quantity
router.post("/", async (req, res) => {
  const { menuItemId, quantity } = req.body;

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Check if the cart item already exists
    let cartItem = await CartItem.findOne({ menuItem: menuItemId });
    if (cartItem) {
      // Update the quantity and adjust the price
      cartItem.quantity = quantity;
      cartItem.price = menuItem.price * cartItem.quantity;
    } else {
      // Create a new cart item with the provided quantity and price
      cartItem = new CartItem({
        menuItem: menuItemId,
        quantity: quantity,
        price: menuItem.price * quantity,
        imageUrl: menuItem.imageUrl,
      });
    }

    const savedCartItem = await cartItem.save();
    res.status(201).json(savedCartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Increment the quantity of a cart item
router.patch("/increment/:id", getCartItem, async (req, res) => {
  try {
    res.cartItem.quantity += 1;
    res.cartItem.price =
      (res.cartItem.price / (res.cartItem.quantity - 1)) *
      res.cartItem.quantity;
    const updatedCartItem = await res.cartItem.save();
    res.json(updatedCartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Decrement the quantity of a cart item
router.patch("/decrement/:id", getCartItem, async (req, res) => {
  try {
    if (res.cartItem.quantity > 1) {
      res.cartItem.quantity -= 1;
      res.cartItem.price =
        (res.cartItem.price / (res.cartItem.quantity + 1)) *
        res.cartItem.quantity;
      const updatedCartItem = await res.cartItem.save();
      res.json(updatedCartItem);
    } else {
      // If the quantity becomes 0, remove the item from the cart
      await res.cartItem.remove();
      res.json({ message: "Item removed from the cart" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove an item from the cart
router.delete("/:id", getCartItem, async (req, res) => {
  try {
    await res.cartItem.remove();
    res.json({ message: "Item removed from the cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Subtotal value
router.get("/subtotal", async (req, res) => {
    try {
      const cartItems = await CartItem.find().populate("menuItem");
      let subtotal = 0;
      for (const cartItem of cartItems) {
        subtotal += cartItem.price || 0;
      }
      res.json({ subtotal });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  

// Middleware function to get a specific cart item by ID
async function getCartItem(req, res, next) {
  let cartItem;
  try {
    cartItem = await CartItem.findById(req.params.id);
    if (cartItem == null) {
      return res.status(404).json({ message: "Cart item not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.cartItem = cartItem;
  next();
}

module.exports = router;
