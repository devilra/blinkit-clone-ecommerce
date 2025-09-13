const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // User reference (must login to place order)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // 🔑 only user allowed
    },

    // Cart Snapshot (price freeze at order time)

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        imageUrl: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountPrice: {
          type: Number,
        },
        currency: {
          type: String,
          default: "INR",
        },
        variant: {
          size: String,
          color: String,
          weight: String,
        },
        subTotal: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Order Summary
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },

    // Coupon Applied
    coupon: {
      code: String,
      discountValue: Number,
      discountType: {
        type: String,
        enum: ["flat", "percentage"],
      },
    },

    // Shipping / Billing

    shippingAddress: {
      fullName: String,
      phone: String,
      email: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "India" },
    },
    billingAddress: {
      fullName: String,
      phone: String,
      email: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: "India" },
    },

    // Payment

    payment: {
      method: { type: String, enum: ["COD", "Card", "UPI", "NetBanking"] },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      paidAt: Date,
    },

    // Order Status

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
            "refunded",
          ],
        },
        note: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    currentStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "pending",
    },

    // Invoice / Tracking

    orderNumber: { type: String, unique: true },
    trackingId: { type: String },
    invoiceUrl: { type: String },

    // Extra

    notes: String,
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
