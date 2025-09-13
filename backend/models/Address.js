const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // each address belongs to user
    },
    // Address Info
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },

    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    landmark: { type: String },

    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },

    // Extra Options
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },

    isDefault: { type: Boolean, default: false }, // default delivery address

    // Geo location (optional → easy to add Google Maps API later)

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // Soft delete / archive
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
