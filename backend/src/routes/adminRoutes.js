import express from "express";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User management
router.get("/users", protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/users/:id/role", protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Category management
router.get("/categories", protect, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/category", protect, requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/category/:id", protect, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json(category);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/category/:id", protect, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

