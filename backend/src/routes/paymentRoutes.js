import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";
import {
  createStripePaymentIntent,
  createRazorpayOrder,
  markOrderPaid,
  testEmail,
  testWelcomeEmail
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/stripe/intent", protect, paymentLimiter, createStripePaymentIntent);
router.post("/razorpay/order", protect, paymentLimiter, createRazorpayOrder);
router.post("/orders/:id/paid", protect, markOrderPaid);
router.post("/test-email", protect, testEmail);
router.post("/test-welcome-email", protect, testWelcomeEmail);

export default router;

