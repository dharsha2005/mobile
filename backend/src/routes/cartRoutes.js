import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:itemId", protect, updateCartItem);
router.delete("/:itemId", protect, removeCartItem);

export default router;

