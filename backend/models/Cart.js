const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Login user reference
      required: false, // guest carts ku optional
    },
    sessionId: {
      type: String, // unique guest identifier
      required: false,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // product ref
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },

        // Price snapshot (for price freeze, discount tracking)
        price: {
          type: Number,
          required: true,
        },
        discountPrice: {
          type: Number, // product  discount snapshot
        },
        currency: {
          type: String,
          default: "INR",
        },

        // Track variations (if product has size, color, weight, etc.)
        variant: {
          size: String,
          color: String,
          weight: String,
        },

        // Subtotal (auto calculate = quantity * price)

        subTotal: {
          type: String,
          default: 0,
        },
      },
    ],

    // Cart level calculations

    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0, // before discount
    },
    totalDiscount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 }, // after discount, tax etc.

    // Coupon / Offer applied
    coupon: {
      code: String,
      discountValue: Number,
      discountType: { type: String, enum: ["flat", "percentage"] },
    },
    // Cart status

    status: {
      type: String,
      enum: ["active", "ordered", "abandoned"],
      default: "active",
    },

    // Expiry (guest carts or abandoned carts auto-clear)
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
