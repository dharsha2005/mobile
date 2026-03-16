import { Cart } from "../models/Cart.js";

const ensureCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }
  // Filter out items with null products (deleted products)
  cart.items = cart.items.filter(item => item.product);
  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await ensureCart(req.user._id);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get cart", error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await ensureCart(req.user._id);
    const existing = cart.items.find((i) => {
      const p = i.product?._id ? i.product._id.toString() : i.product.toString();
      return p === productId;
    });
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate("items.product");
    // Filter out items with null products
    cart.items = cart.items.filter(item => item.product);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await ensureCart(req.user._id);
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    if (Number(quantity) < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");
    // Filter out items with null products
    cart.items = cart.items.filter(item => item.product);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await ensureCart(req.user._id);
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate("items.product");
    // Filter out items with null products
    cart.items = cart.items.filter(item => item.product);
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
};

