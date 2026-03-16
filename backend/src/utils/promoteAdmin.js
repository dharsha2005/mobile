import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

// Usage: node src/utils/promoteAdmin.js user@example.com
// This script will locate the user by email and set their role to "admin".

async function promote(email) {
  if (!email) {
    console.error("Please provide an email address as the first argument.");
    process.exit(1);
  }

  await connectDB();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`No user found with email \"${email}\"`);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log(`User ${email} has been promoted to admin.`);
    process.exit(0);
  } catch (err) {
    console.error("Error promoting user:", err);
    process.exit(1);
  }
}

promote(process.argv[2]);
