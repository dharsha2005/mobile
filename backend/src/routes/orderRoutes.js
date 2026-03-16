import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/me", protect, getMyOrders);
router.get("/", protect, requireAdmin, getAllOrders);
router.put("/:id/status", protect, requireAdmin, updateOrderStatus);

export default router;

