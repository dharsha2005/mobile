import { Review } from "../models/Review.js";

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      approved: true
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get reviews", error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({
      product: req.params.productId,
      user: req.user._id
    });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.approved = false;
      await existing.save();
      return res.json(existing);
    }
    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      rating,
      comment
    });
    return res.status(201).json(review);
  } catch (err) {
    return res.status(500).json({ message: "Failed to add review", error: err.message });
  }
};

export const adminListReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ message: "Failed to list reviews", error: err.message });
  }
};

export const adminUpdateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.json(review);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update review", error: err.message });
  }
};

export const adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.json({ message: "Review deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete review", error: err.message });
  }
};

