const Address = require("../models/Address");
const Cart = require("../models/Cart");

exports.checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId, manualAddress } = req.body; // 👈 manualAddress optional

    // 1. Get active cart
    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let shippingAddress;

    // 2. If addressId provided → use saved address
    if (addressId) {
      const address = await Address.findOne({ _id: addressId, user: userId });
      if (!address) {
        return res.status(400).json({ message: "Invalid saved address" });
      }
      shippingAddress = {
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      };
    }
    // 3. Else if manualAddress provided → use that
    else if (manualAddress) {
      shippingAddress = manualAddress;
    } else {
      return res
        .status(400)
        .json({ message: "Address required (saved or manual)" });
    }

    // 4. Prepare response data (NO order creation here)
    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      discountPrice: item.discountPrice,
      subTotal: item.subTotal,
    }));

    res.status(200).json({
      message: "Checkout summary",
      cartSummary: {
        items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        totalDiscount: cart.totalDiscount,
        finalAmount: cart.finalAmount,
        coupon: cart.coupon,
      },
      shippingAddress, // 👈 dynamic (saved or manual)
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
