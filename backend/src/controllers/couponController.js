import { Coupon } from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json(coupon);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create coupon", error: err.message });
  }
};

export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.json(coupons);
  } catch (err) {
    return res.status(500).json({ message: "Failed to list coupons", error: err.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res.json(coupon);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update coupon", error: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res.json({ message: "Coupon deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete coupon", error: err.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }
    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }
    return res.json(coupon);
  } catch (err) {
    return res.status(500).json({ message: "Failed to validate coupon", error: err.message });
  }
};

