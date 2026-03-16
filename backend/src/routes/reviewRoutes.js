import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  getProductReviews,
  addReview,
  adminListReviews,
  adminUpdateReview,
  adminDeleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/product/:productId", protect, addReview);

router.get("/admin", protect, requireAdmin, adminListReviews);
router.put("/admin/:id", protect, requireAdmin, adminUpdateReview);
router.delete("/admin/:id", protect, requireAdmin, adminDeleteReview);

export default router;

