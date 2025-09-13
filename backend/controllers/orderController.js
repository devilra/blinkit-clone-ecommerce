// @desc    Create new order from active cart
// @route   POST /api/orders

const Address = require("../models/Address");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      addressId,
      paymentMethod,
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    } = req.body;

    // Get user active cart
    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let shippingAddress;

    if (addressId) {
      // Saved address selected
      const address = await Address.findById(addressId);
      if (!address) return res.status(400).json({ message: "Invalid address" });

      shippingAddress = address;
    } else {
      // Manual address entered
      if (
        !fullName ||
        !phone ||
        !addressLine1 ||
        !city ||
        !state ||
        !postalCode
      ) {
        return res
          .status(400)
          .json({ message: "Please provide complete address details" });
      }

      shippingAddress = {
        fullName,
        phone,
        email: email || "",
        addressLine1,
        addressLine2: addressLine2 || "",
        city,
        state,
        postalCode,
        country: country || "India",
      };
    }

    // Create order
    const order = new Order({
      user: userId,
      items: cart.items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.price,
        subTotal: i.price * i.quantity,
      })),
      shippingAddress, // Save snapshot or reference
      totalItems: cart.items.length,
      totalPrice: cart.totalPrice,
      paymentMethod,
      status: "pending",
    });

    await order.save();

    // Clear cart after order
    cart.items = [];
    cart.totalPrice = 0;
    cart.status = "ordered";

    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// @desc    Get all orders of logged in user
// @route   GET /api/orders/my
// @access  Private

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      order.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body; // pending, processing, shipped, delivered, cancelled

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ 1. update currentStatus
    order.currentStatus = status || order.currentStatus;

    // ✅ 2. push statusHistory log
    order.statusHistory.push({
      status,
      note: note || "",
      updatedAt: new Date(),
    });

    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};
