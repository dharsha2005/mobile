import mongoose from "mongoose";
import { DATABASE_URI } from "./env.js";

export const connectDB = async () => {
  if (!DATABASE_URI) {
    throw new Error("Database URI is not defined (set MONGODB_URI or MONGO_URI)");
  }

  try {
    await mongoose.connect(DATABASE_URI);
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
};
