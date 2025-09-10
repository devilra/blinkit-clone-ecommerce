const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/admin");
const upload = require("../middleware/upload");
const router = express.Router();

// Public
router.get("/", getProducts);

// Admin
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  createProduct
);

// Public
router.get("/:id", getProductById);
// Admin - Update Product
router.put(
  "/:id",
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  updateProduct
);

module.exports = router;
