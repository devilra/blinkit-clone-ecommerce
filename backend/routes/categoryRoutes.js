const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/admin");
const router = express.Router();

// Public
router.get("/", getCategories);

//Admin Only
router.post("/", protect, admin, createCategory);

//Public
router.get("/:id", getCategoryById);

//Admin Only
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
