import express from "express";
import { body } from "express-validator";
import passport from "passport";
import {
  register,
  login,
  googleCallbackHandler,
  getProfile,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const router = express.Router();

// Minimal test route
router.get("/minimal-test", (req, res) => {
  res.json({ message: "Router is working" });
});

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  register
);

router.post("/login", login);

router.post("/forgot-password", body("email").isEmail(), forgotPassword);
router.post(
  "/reset-password",
  body("password").isLength({ min: 6 }),
  resetPassword
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackHandler
);

router.get("/me", protect, getProfile);

export default router;

