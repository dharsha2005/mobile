import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    googleId: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    addresses: [addressSchema],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);

