const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");
const router = express.Router();

// ✅ Add new address
router.post("/", protect, addAddress);

// ✅ Get all addresses of logged-in user
router.get("/", protect, getAddresses);

// ✅ Update specific address
router.put("/:id", protect, updateAddress);

// ✅ Delete specific address
router.delete("/:id", protect, deleteAddress);

// ✅ Set default address
router.put("/:id/default", protect, setDefaultAddress);

module.exports = router;
