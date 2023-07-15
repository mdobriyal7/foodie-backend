const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const CartItem = require('../model/cartItem');

// Create an order
router.post('/', async (req, res) => {
    try {
      // Get the user's cart items
      const cartItems = await CartItem.find().populate('menuItem');
  
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      // Calculate the total amount of the order
      const totalAmount = cartItems.reduce((total, item) => {
        return total + item.menuItem.price * item.quantity;
      }, 0);
  
      // Use a default address for simplicity
      const address = '201 House No,Mawakot,Kotdwara,Pauri Garhwal';
  
      // Use an estimated delivery time for simplicity
      const estimatedTime = 'Arriving in 30 min';
  
      // Create the order
      const order = new Order({
        items: cartItems.map(item => ({
          name: item.menuItem.name,
          price: item.menuItem.price,
            quantity: item.quantity,
          imageUrl:item.imageUrl,
        })),
        totalAmount,
        address,
        estimatedTime,
      });
  
      // Save the order to the database
      const savedOrder = await order.save();
  
      // Clear the user's cart
      await CartItem.deleteMany();
  
      res.status(201).json(savedOrder);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get all orders
  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get a specific order
  router.get('/:id', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
