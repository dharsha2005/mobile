import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String },
    stock: { type: Number, default: 0 },
    images: [imageSchema],
    rating: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Product = mongoose.model("Product", productSchema);

