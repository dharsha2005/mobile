const mongoose = require('mongoose');
const { Product } = require('../src/models/Product');
const { Category } = require('../src/models/Category');

mongoose.connect('mongodb://localhost:27017/gadgetra');

const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 6.7-inch Super Retina XDR display, ProMotion technology, and Dynamic Island. Now available in India with warranty.",
    price: 149999,
    brand: "Apple",
    stock: 25,
    category: "Smartphones",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=800&h=600&fit=crop",
        publicId: "iphone-15-pro-max"
      },
      {
        url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
        publicId: "iphone-15-pro-max-side"
      }
    ],
    rating: 4.8
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and 6.8-inch Dynamic AMOLED display. Features Snapdragon 8 Gen 3 processor and 5000mAh battery. Official India warranty.",
    price: 124999,
    brand: "Samsung",
    stock: 18,
    category: "Smartphones",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945415295-d9bb9ec1c6d3?w=800&h=600&fit=crop",
        publicId: "galaxy-s24-ultra"
      }
    ],
    rating: 4.7
  },
  {
    name: "MacBook Pro 16-inch",
    description: "Powerful laptop with M3 Pro chip, 16-inch Liquid Retina XDR display, and up to 22 hours battery life. Perfect for professionals and creators. Available with India warranty.",
    price: 249999,
    brand: "Apple",
    stock: 12,
    category: "Laptops",
    images: [
      {
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        publicId: "macbook-pro-16"
      }
    ],
    rating: 4.9
  },
  {
    name: "Dell XPS 15",
    description: "High-performance laptop with Intel Core i9, NVIDIA RTX 4070, and stunning 4K OLED display. Ideal for gaming and creative work.",
    price: 1899.99,
    brand: "Dell",
    stock: 8,
    category: "Laptops",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
        publicId: "dell-xps-15"
      }
    ],
    rating: 4.6
  },
  {
    name: "AirPods Pro 2",
    description: "Active noise cancellation with up to 2x more noise reduction. Adaptive transparency and personalized spatial audio with dynamic head tracking.",
    price: 249.99,
    brand: "Apple",
    stock: 45,
    category: "Audio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop",
        publicId: "airpods-pro-2"
      }
    ],
    rating: 4.5
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life, and multipoint connection.",
    price: 399.99,
    brand: "Sony",
    stock: 22,
    category: "Audio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        publicId: "sony-wh1000xm5"
      }
    ],
    rating: 4.7
  },
  {
    name: "iPad Pro 12.9-inch",
    description: "Most powerful iPad with M2 chip, 12.9-inch Liquid Retina XDR display, and support for Apple Pencil and Magic Keyboard.",
    price: 1099.99,
    brand: "Apple",
    stock: 15,
    category: "Tablets",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop",
        publicId: "ipad-pro-129"
      }
    ],
    rating: 4.8
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "Premium Android tablet with 14.6-inch Dynamic AMOLED display, S Pen included, and desktop-like DeX mode.",
    price: 1199.99,
    brand: "Samsung",
    stock: 10,
    category: "Tablets",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop",
        publicId: "galaxy-tab-s9-ultra"
      }
    ],
    rating: 4.6
  },
  {
    name: "Apple Watch Series 9",
    description: "Advanced smartwatch with health monitoring, fitness tracking, and seamless iPhone integration. Features bright Always-On Retina display.",
    price: 429.99,
    brand: "Apple",
    stock: 30,
    category: "Wearables",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551816235-ef5deaed4a26?w=800&h=600&fit=crop",
        publicId: "apple-watch-s9"
      }
    ],
    rating: 4.5
  },
  {
    name: "Garmin Fenix 7X",
    description: "Rugged multisport GPS watch with advanced training features, long battery life, and comprehensive health monitoring.",
    price: 799.99,
    brand: "Garmin",
    stock: 6,
    category: "Wearables",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
        publicId: "garmin-fenix-7x"
      }
    ],
    rating: 4.4
  }
];

const categories = [
  { name: "Smartphones", description: "Latest smartphones and mobile devices", slug: "smartphones" },
  { name: "Laptops", description: "Professional and gaming laptops", slug: "laptops" },
  { name: "Audio", description: "Headphones, earbuds, and audio equipment", slug: "audio" },
  { name: "Tablets", description: "Tablets and mobile computing devices", slug: "tablets" },
  { name: "Wearables", description: "Smartwatches and fitness trackers", slug: "wearables" }
];

async function addSampleData() {
  try {
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('Adding categories...');
    const createdCategories = await Category.create(categories);
    console.log(`Created ${createdCategories.length} categories`);

    console.log('Adding products...');
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    const productsWithCategories = sampleProducts.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    const createdProducts = await Product.create(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Sample data added successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding sample data:', error);
    mongoose.connection.close();
  }
}

addSampleData();
