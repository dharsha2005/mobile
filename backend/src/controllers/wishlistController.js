import { Wishlist } from "../models/Wishlist.js";

const ensureWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
    wishlist = await wishlist.populate("products");
  }
  return wishlist;
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await ensureWishlist(req.user._id);
    return res.json(wishlist);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get wishlist", error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await ensureWishlist(req.user._id);
    if (!wishlist.products.find((p) => p._id.toString() === productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
    await wishlist.populate("products");
    return res.json(wishlist);
  } catch (err) {
    return res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await ensureWishlist(req.user._id);
    wishlist.products = wishlist.products.filter(
      (p) => p._id.toString() !== req.params.productId
    );
    await wishlist.save();
    await wishlist.populate("products");
    return res.json(wishlist);
  } catch (err) {
    return res.status(500).json({ message: "Failed to remove from wishlist", error: err.message });
  }
};

