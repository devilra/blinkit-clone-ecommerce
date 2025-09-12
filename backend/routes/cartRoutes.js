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
const router = express.Router();

// Cart Routes (guest also allowed)

// Add to cart
router.post("/add", addToCart);

// Get cart
router.get("/", getCart);

// Update quantity
router.put("/update", updateQuantity);

//increase quantity
router.put("/increase", increaseQuantity);

//decrease quantity
router.put("/decrease", decreaseQuantity);

// Remove item
router.delete("/remove", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

module.exports = router;
