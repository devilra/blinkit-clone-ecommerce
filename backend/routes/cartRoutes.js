const express = require("express");
const {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Cart Routes (guest also allowed)

// Add to cart
router.post("/add", protect, addToCart);

// Get cart
router.get("/", protect, getCart);

// Update quantity
router.put("/update", protect, updateQuantity);

//increase quantity
router.put("/increase", protect, increaseQuantity);

//decrease quantity
router.put("/decrease", protect, decreaseQuantity);

// Remove item
router.delete("/remove", protect, removeFromCart);

// Clear cart
router.delete("/clear", protect, clearCart);

module.exports = router;
