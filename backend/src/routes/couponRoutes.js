import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  createCoupon,
  listCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} from "../controllers/couponController.js";

const router = express.Router();

router.get("/", protect, requireAdmin, listCoupons);
router.post("/", protect, requireAdmin, createCoupon);
router.put("/:id", protect, requireAdmin, updateCoupon);
router.delete("/:id", protect, requireAdmin, deleteCoupon);

router.post("/validate", protect, validateCoupon);

export default router;

