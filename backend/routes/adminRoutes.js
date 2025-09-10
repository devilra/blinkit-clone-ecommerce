const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  updateUserRole,
  toggleUserActive,
} = require("../controllers/adminController");
const { admin, superAdmin } = require("../middleware/admin");
const router = express.Router();

// 🔐 only admin & superadmin
router.get("/users", protect, admin, getAllUsers);

// 🔐 only superadmin can change roles
router.put("/users/:id/role", protect, superAdmin, updateUserRole);

// 🔐 admin or superadmin can block/unblock
router.put("/users/:id/toggle", protect, superAdmin, toggleUserActive);

module.exports = router;
