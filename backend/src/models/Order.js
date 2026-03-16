import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    address: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      default: "cod"
    },
    paymentProvider: {
      type: String,
      enum: ["stripe", "razorpay", "none"],
      default: "none"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Order = mongoose.model("Order", orderSchema);

