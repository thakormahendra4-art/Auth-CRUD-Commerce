import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

const sampleProducts = [
  // Electronics
  {
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    description: "Industry-leading noise canceling wireless headphones with two processors, 8 microphones for exceptional sound quality, and crystal-clear hands-free calling.",
    price: 26990,
    stock: 15,
    category: "Electronics",
    image: {
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-sony-wh1000xm5",
    },
  },
  {
    title: "Apple Watch Series 9 GPS 45mm Midnight",
    description: "Advanced health sensors and workout tracking metrics, ECG capabilities, crash detection, and Always-On Retina OLED display with fast charging.",
    price: 41900,
    stock: 8,
    category: "Electronics",
    image: {
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-apple-watch-s9",
    },
  },

  // Clothing
  {
    title: "Classic Vintage Denim Trucker Jacket",
    description: "Timeless 100% cotton washed denim jacket with dual chest flap pockets, button closure, and tailored comfortable fit for everyday layering.",
    price: 2499,
    stock: 25,
    category: "Clothing",
    image: {
      url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-denim-jacket",
    },
  },
  {
    title: "Organic Cotton Heavyweight Fleece Hoodie",
    description: "Ultra-soft heavyweight fleece hoodie with brushed interior, spacious kangaroo pocket, and ribbed cuffs. Sustainable, breathable, and warm.",
    price: 1799,
    stock: 30,
    category: "Clothing",
    image: {
      url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-fleece-hoodie",
    },
  },

  // Books
  {
    title: "Atomic Habits by James Clear",
    description: "An easy and proven way to build good habits and break bad ones. The bestselling comprehensive guide on daily compound improvements and habit architecture.",
    price: 550,
    stock: 50,
    category: "Books",
    image: {
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-atomic-habits",
    },
  },
  {
    title: "The Psychology of Money by Morgan Housel",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money is more about how you behave than what you know.",
    price: 399,
    stock: 40,
    category: "Books",
    image: {
      url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-psychology-money",
    },
  },

  // Home & Kitchen
  {
    title: "Artisan Ceramic Pour-Over Coffee Maker Set",
    description: "Handcrafted matte ceramic coffee dripper with heat-resistant borosilicate glass carafe for the ultimate barista-quality brew at home.",
    price: 1899,
    stock: 18,
    category: "Home & Kitchen",
    image: {
      url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-pourover-coffee",
    },
  },
  {
    title: "Pre-Seasoned Cast Iron Skillet 10-Inch",
    description: "Heavy-duty cast iron pan for searing, baking, grilling, and sautéing with superior heat retention and uniform cooking performance.",
    price: 1450,
    stock: 22,
    category: "Home & Kitchen",
    image: {
      url: "https://images.unsplash.com/photo-1584990347449-307f594519f7?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-castiron-skillet",
    },
  },

  // Beauty
  {
    title: "Vitamin C Radiant Glow Facial Serum 30ml",
    description: "Pure Vitamin C + Hyaluronic Acid face serum for deep hydration, dark spot reduction, and a luminous, youthful skin complexion.",
    price: 899,
    stock: 35,
    category: "Beauty",
    image: {
      url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-vitaminc-serum",
    },
  },
  {
    title: "Botanical Herbal Hydrating Face Moisturizer",
    description: "Lightweight, non-greasy daily moisturizer enriched with green tea extracts, aloe vera, and shea butter for 24-hour nourishment.",
    price: 1199,
    stock: 20,
    category: "Beauty",
    image: {
      url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-herbal-cream",
    },
  },

  // Other
  {
    title: "Ergonomic Memory Foam Travel Pillow",
    description: "360-degree head and neck support pillow with breathable washable cover and compact carry pouch for comfortable flights and road trips.",
    price: 999,
    stock: 28,
    category: "Other",
    image: {
      url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
      fileId: "seed-travel-pillow",
    },
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Find seller user
    let seller = await User.findOne({ role: "seller" });

    if (!seller) {
      console.log("No seller found, checking any user...");
      seller = await User.findOne({});
    }

    if (!seller) {
      console.error("No user found in database. Please register a seller account first.");
      process.exit(1);
    }

    console.log(`Seeding products for seller: ${seller.name} (${seller.email}, ID: ${seller._id})`);

    let createdCount = 0;

    for (const item of sampleProducts) {
      const existing = await Product.findOne({ title: item.title });
      if (!existing) {
        await Product.create({
          ...item,
          createdBy: seller._id,
        });
        createdCount++;
        console.log(`+ Created product: [${item.category}] ${item.title}`);
      } else {
        console.log(`= Already exists: ${item.title}`);
      }
    }

    console.log(`\nSuccessfully seeded ${createdCount} products!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedProducts();
