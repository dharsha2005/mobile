import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export const Category = mongoose.model("Category", categorySchema);

