const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

// Utility to recalc total
const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// Helper to get identifier

const getIdentifier = (req, res) => {
  if (req.user) {
    return { userId: req.user._id, sessionId: null };
  } else {
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        //secure:false    //production
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
    return { userId: null, sessionId };
  }
};

// @desc Add item to cart

exports.addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Please login to add items to cart" });
    }

    const { productId, quantity } = req.body;
    //const { userId, sessionId } = getIdentifier(req, res);

    const userId = req.user._id;

    //console.log(productId, quantity);

    // Product check
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        price: product.discountPrice || product.price, // snapshot
      });
    }
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    //const { userId, sessionId } = getIdentifier(req, res);

    if (!req.user) {
      return res.status(401).json({ message: "Please login to view cart" });
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    }).populate("items.product");

    if (!cart)
      return res.status(200).json({ cart: { items: [], totalPrice: 0 } });

    res.status(200).json({
      count: cart.length,
      cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// @desc Update item quantity

exports.updateQuantity = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login" });
    }
    const { productId, quantity } = req.body;
    //const { userId, sessionId } = getIdentifier(req, res);

    const userId = req.user._id;

    const cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quantity", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login" });
    }

    const { productId } = req.body;
    //const { userId, sessionId } = getIdentifier(req, res);

    const userId = req.user._id;

    const cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.totalPrice = calculateTotal(cart.items);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing item", error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login" });
    }

    //const { userId, sessionId } = getIdentifier(req, res);

    const userId = req.user._id;

    let cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

// @desc Increase item quantity
exports.increaseQuantity = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login" });
    }

    const { productId } = req.body;
    const userId = req.user._id;
    // const { userId, sessionId } = getIdentifier(req, res);

    const cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity += 1;
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ message: "Quantity increased", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error increasing quantity", error: error.message });
  }
};

// @desc Decrease item quantity

exports.decreaseQuantity = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login" });
    }

    const { productId } = req.body;
    //const { userId, sessionId } = getIdentifier(req, res);

    const userId = req.user._id;

    const cart = await Cart.findOne({
      $or: [{ user: userId }],
      status: "active",
    });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // If 1 item irundhu decrease panna -> remove item
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    }

    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ message: "Quantity decreased", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error decreasing quantity", error: error.message });
  }
};
