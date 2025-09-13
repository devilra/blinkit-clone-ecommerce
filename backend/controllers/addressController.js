const Address = require("../models/Address");

exports.addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const newAddress = new Address({
      user: req.user._id,
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    // if isDefault = true, make other addresses false

    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const saved = await newAddress.save();

    res.status(201).json({ message: "Address added", address: saved });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding address", error: error.message });
  }
};

// @desc    Get all user addresses
// @route   GET /api/address
// @access  Private

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json({ addresses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/address/:id
// @access  Private

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    let address = await Address.findOne({ _id: id, user: req.user._id });

    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, req.body);

    // handle default change
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const updated = await address.save();
    res.json({ message: "Address updated", address: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/address/:id
// @access  Private

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.json({ message: "Address deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/address/:id/default
// @access  Private

exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    // reset others
    await Address.updateMany(
      {
        user: req.user._id,
        isDefault: true,
      },
      {
        isDefault: false,
      }
    );

    address.isDefault = true;
    await address.save();

    res.json({ message: "Default address set", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting default", error: error.message });
  }
};
