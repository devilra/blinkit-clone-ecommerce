const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { admin } = require("../middleware/admin");
const { checkout } = require("../controllers/checkoutController");
const router = express.Router();

// ================== User Routes ==================

// ✅ Create order (from active cart)

router.post("/", protect, createOrder);

// Checkout (place order)
router.post("/checkout", protect, checkout);

// ✅ Get logged in user orders
router.get("/my", protect, getMyOrders);

// ✅ Get single order
router.get("/:id", protect, getOrderById);

// ================== Admin Routes ==================

// ✅ Get all orders
router.get("/", protect, admin, getAllOrders);

// ✅ Update order status
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
