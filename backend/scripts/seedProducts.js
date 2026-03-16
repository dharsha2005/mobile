import mongoose from "mongoose";
import { Product } from "../src/models/Product.js";
import { Category } from "../src/models/Category.js";
import { connectDB } from "../src/config/db.js";

const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    price: 1199,
    brand: "Apple",
    stock: 25,
    images: [
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
        publicId: "iphone15promax"
      }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android phone with S Pen, 200MP camera, and AI features",
    price: 1299,
    brand: "Samsung",
    stock: 30,
    images: [
      {
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
        publicId: "galaxys24ultra"
      }
    ]
  },
  {
    name: "MacBook Pro 16\"",
    description: "Powerful laptop with M3 Max chip, perfect for creative professionals",
    price: 2499,
    brand: "Apple",
    stock: 15,
    images: [
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        publicId: "macbookpro16"
      }
    ]
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with exceptional sound quality",
    price: 399,
    brand: "Sony",
    stock: 50,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        publicId: "sonyheadphones"
      }
    ]
  },
  {
    name: "iPad Air",
    description: "Versatile tablet with M1 chip, perfect for work and entertainment",
    price: 599,
    brand: "Apple",
    stock: 35,
    images: [
      {
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        publicId: "ipadair"
      }
    ]
  },
  {
    name: "Apple Watch Series 9",
    description: "Advanced health and fitness tracking with bright display and powerful features",
    price: 429,
    brand: "Apple",
    stock: 40,
    images: [
      {
        url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
        publicId: "applewatch9"
      }
    ]
  },
  {
    name: "Dell XPS 15 Laptop",
    description: "High-performance Windows laptop with stunning 4K display and powerful graphics",
    price: 1799,
    brand: "Dell",
    stock: 20,
    images: [
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        publicId: "dellxps15"
      }
    ]
  },
  {
    name: "AirPods Pro 2",
    description: "Premium wireless earbuds with active noise cancellation and spatial audio",
    price: 249,
    brand: "Apple",
    stock: 60,
    images: [
      {
        url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop",
        publicId: "airpodspro2"
      }
    ]
  },
  {
    name: "Samsung 65\" QLED TV",
    description: "Stunning 4K QLED TV with vibrant colors and smart TV features",
    price: 1299,
    brand: "Samsung",
    stock: 10,
    images: [
      {
        url: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop",
        publicId: "samsungqled65"
      }
    ]
  },
  {
    name: "Nintendo Switch OLED",
    description: "Portable gaming console with vibrant 7-inch OLED screen",
    price: 349,
    brand: "Nintendo",
    stock: 45,
    images: [
      {
        url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop",
        publicId: "nintendoswitch"
      }
    ]
  },
  {
    name: "Google Pixel 8 Pro",
    description: "Advanced Android phone with exceptional camera and AI features",
    price: 999,
    brand: "Google",
    stock: 25,
    images: [
      {
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
        publicId: "pixel8pro"
      }
    ]
  },
  {
    name: "Bose QuietComfort Earbuds",
    description: "Comfortable wireless earbuds with world-class noise cancellation",
    price: 279,
    brand: "Bose",
    stock: 35,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        publicId: "boseearbuds"
      }
    ]
  }
];

async function seedProducts() {
  try {
    await connectDB();
    
    // Get categories
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log("No categories found. Please seed categories first.");
      return;
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Add products with random categories
    const productsToAdd = sampleProducts.map((product, index) => ({
      ...product,
      category: categories[index % categories.length]._id,
      rating: 4.0 + Math.random() * 1.0 // Random rating between 4.0 and 5.0
    }));

    await Product.insertMany(productsToAdd);
    console.log(`Added ${productsToAdd.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
