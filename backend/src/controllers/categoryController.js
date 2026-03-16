import { Category } from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
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
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

