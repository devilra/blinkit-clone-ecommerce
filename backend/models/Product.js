const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true },
    // Category Relation (No mismatch with your category schema)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // Pricing
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // optional, for offers
    currency: { type: String, default: "INR" },

    // Inventory
    stock: { type: Number, default: 0 },
    unit: { type: String }, // e.g., "kg", "ltr", "pcs"
    sku: { type: String, unique: true }, // unique product code

    // Media
    imageUrl: { type: String }, // main image
    gallery: [String], // multiple images

    // Reviews & Ratings
    rating: { type: Number, default: 0 }, // avg rating
    reviewCount: { type: Number, default: 0 },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Status & Flags
    status: {
      type: String,
      enum: ["active", "inactive", "out-of-stock", "archived"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false }, // highlight product

    // SEO & Metadata
    metaTitle: { type: String },
    metaDescription: { type: String },
    tags: [String], // e.g., ["pickle", "mango", "organic"]

    // Tracking
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
