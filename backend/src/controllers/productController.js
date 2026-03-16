import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";

const resolveCategoryId = async (category) => {
  if (!category) return undefined;
  if (mongoose.isValidObjectId(category)) return category;

  const str = category.toString().trim();
  if (!str) return undefined;

  const slug = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const cat = await Category.findOne({
    $or: [{ slug }, { name: new RegExp(`^${str}$`, "i") }]
  });

  return cat?._id;
};

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort = "newest",
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};

    // Text search across name and brand
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { brand: regex }];
    }

    // Category by id or slug
    if (category) {
      let categoryId = null;
      if (mongoose.isValidObjectId(category)) {
        categoryId = category;
      } else {
        const cat = await Category.findOne({ slug: category.toString().toLowerCase() });
        if (cat) {
          categoryId = cat._id;
        } else {
          // no such category => empty result
          return res.json({ items: [], total: 0, page: Number(page), pages: 0 });
        }
      }
      filter.category = categoryId;
    }

    if (brand) {
      filter.brand = new RegExp(`^${brand}$`, "i");
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "top_rated") sortOption = { rating: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("category")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    return res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }
    const regex = new RegExp(query, "i");

    const categories = await Category.find({
      $or: [{ name: regex }, { slug: regex }]
    }).select("_id");
    const categoryIds = categories.map((c) => c._id);

    const filter = {
      $or: [
        { name: regex },
        { brand: regex },
        ...(categoryIds.length ? [{ category: { $in: categoryIds } }] : [])
      ]
    };

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    const images = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename
    }));

    const categoryId = await resolveCategoryId(category);
    if (category && !categoryId) {
      return res.status(400).json({ message: "Invalid category (use an existing category name/slug/id)" });
    }

    if (!name || !description || typeof price === "undefined") {
      return res.status(400).json({ message: "name, description and price are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category: categoryId,
      brand,
      stock,
      images
    });

    return res.status(201).json(product);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("createProduct error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    if (Object.prototype.hasOwnProperty.call(updates, "category")) {
      const categoryId = await resolveCategoryId(updates.category);
      if (updates.category && !categoryId) {
        return res.status(400).json({ message: "Invalid category (use an existing category name/slug/id)" });
      }
      updates.category = categoryId;
    }
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename
      }));
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

