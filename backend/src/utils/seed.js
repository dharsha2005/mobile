import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const demoImage = (name) => ({
  // Public demo Cloudinary image (replace with your own uploads later)
  url: "https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/sample.jpg",
  publicId: `demo-${name}`.toLowerCase().replace(/\s+/g, "-")
});

const categoriesData = [
  { name: "Smartphones", description: "Android and iOS smartphones" },
  { name: "Laptops", description: "Gaming, ultrabooks and productivity laptops" },
  { name: "Audio", description: "Headphones, earbuds, speakers" },
  { name: "Accessories", description: "Chargers, cables, cases, power banks" },
  { name: "Gaming", description: "Consoles, controllers, gaming accessories" }
];

const productsData = (categoryMap) => [
  {
    name: "Nova X12 Pro 5G",
    description: "6.7-inch AMOLED, Snapdragon 8-series, 120Hz, 50MP triple camera.",
    price: 799,
    category: categoryMap.Smartphones,
    brand: "Nova",
    stock: 25,
    images: [demoImage("Nova X12 Pro 5G")],
    rating: 4.6
  },
  {
    name: "PixelCore A9",
    description: "Compact flagship with excellent camera and clean OS experience.",
    price: 699,
    category: categoryMap.Smartphones,
    brand: "PixelCore",
    stock: 30,
    images: [demoImage("PixelCore A9")],
    rating: 4.5
  },
  {
    name: "ZenBook Air 14",
    description: "Ultra-light 14-inch laptop, 16GB RAM, 512GB SSD, all-day battery.",
    price: 999,
    category: categoryMap.Laptops,
    brand: "Zen",
    stock: 12,
    images: [demoImage("ZenBook Air 14")],
    rating: 4.4
  },
  {
    name: "Titan Gaming 16",
    description: "RTX graphics, 165Hz display, high performance cooling for gaming.",
    price: 1499,
    category: categoryMap.Laptops,
    brand: "Titan",
    stock: 8,
    images: [demoImage("Titan Gaming 16")],
    rating: 4.7
  },
  {
    name: "WaveBuds ANC",
    description: "Active noise cancellation, 30-hour battery, fast charge.",
    price: 129,
    category: categoryMap.Audio,
    brand: "Wave",
    stock: 60,
    images: [demoImage("WaveBuds ANC")],
    rating: 4.3
  },
  {
    name: "SoundSphere Mini",
    description: "Portable Bluetooth speaker with punchy bass and IPX7 waterproofing.",
    price: 89,
    category: categoryMap.Audio,
    brand: "SoundSphere",
    stock: 45,
    images: [demoImage("SoundSphere Mini")],
    rating: 4.2
  },
  {
    name: "PowerMax 20,000mAh",
    description: "Fast charging power bank with USB-C PD and dual outputs.",
    price: 49,
    category: categoryMap.Accessories,
    brand: "PowerMax",
    stock: 100,
    images: [demoImage("PowerMax 20000")],
    rating: 4.4
  },
  {
    name: "RapidCharge 65W GaN",
    description: "Compact 65W GaN charger for laptops and phones with USB-C PD.",
    price: 39,
    category: categoryMap.Accessories,
    brand: "RapidCharge",
    stock: 70,
    images: [demoImage("RapidCharge 65W")],
    rating: 4.6
  },
  {
    name: "GamePro Controller X",
    description: "Low-latency wireless controller with hall-effect sticks and rumble.",
    price: 59,
    category: categoryMap.Gaming,
    brand: "GamePro",
    stock: 40,
    images: [demoImage("GamePro Controller X")],
    rating: 4.5
  },
  {
    name: "VR Edge Headset",
    description: "Immersive VR headset with high-res lenses and comfortable straps.",
    price: 299,
    category: categoryMap.Gaming,
    brand: "Edge",
    stock: 10,
    images: [demoImage("VR Edge Headset")],
    rating: 4.1
  }
];

async function run() {
  await connectDB();

  await Product.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});

  const categories = await Category.insertMany(categoriesData);
  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  await Product.insertMany(productsData(categoryMap));

  await User.create({
    name: "Admin",
    email: "admin@gadgetra.com",
    password: "Admin@123",
    role: "admin"
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete: categories, products, and admin user inserted.");

  await mongoose.connection.close();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Seed failed", err);
  process.exit(1);
});

