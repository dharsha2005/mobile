import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/productController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gadgetra/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

const upload = multer({ storage });

router.get("/search", searchProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  requireAdmin,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", protect, requireAdmin, deleteProduct);

export default router;

