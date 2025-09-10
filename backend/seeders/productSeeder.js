const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");
const Product = require("../models/Product");
const Category = require("../models/Category");

dotenv.config();
MONGO_URI =
  "mongodb+srv://raja:raja@cluster0.cdldg3o.mongodb.net/naatusarkarai";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => console.error("DB Connection Error:", err));

const seedProducts = async () => {
  try {
    // Clear old data
    await Product.deleteMany();
    // Get all categories from DB
    const categories = await Category.find({});
    console.log("categories", categories);
    if (categories.length === 0) {
      console.log("No categories found! Please seed categories first.");
      process.exit();
    }

    // Pick categories map for quick lookup

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("categoryMap", categoryMap);

    const products = [
      {
        name: "Classic Paan",
        slug: slugify("Classic Paan", { lower: true }),
        description: "Fresh and aromatic paan leaves with sweet fillings.",
        category: categoryMap["Paan Corner"],
        price: 20,
        stock: 100,
        unit: "pcs",
        sku: "PAAN001",
        imageUrl: "/products/p1.jpg",
      },
      {
        name: "Fried Paan",
        slug: slugify("Fried Paan", { lower: true }),
        description: "Fresh and aromatic paan leaves with sweet fillings.",
        category: categoryMap["Paan Corner"],
        price: 40,
        stock: 100,
        unit: "pcs",
        sku: "PAAN002",
        imageUrl: "/products/p2.webp",
      },
      {
        name: "Whole Milk 1L",
        slug: slugify("Whole Milk 1L", { lower: true }),
        description: "Pure dairy milk rich in calcium.",
        category: categoryMap["Dairy, Bread & Eggs"],
        price: 60,
        stock: 50,
        unit: "ltr",
        sku: "MILK001",
        imageUrl: "/products/p3.jpg",
      },
      {
        name: "Milk 1L",
        slug: slugify("Milk 1L", { lower: true }),
        description: "Pure dairy milk rich in calcium.",
        category: categoryMap["Dairy, Bread & Eggs"],
        price: 100,
        stock: 50,
        unit: "ltr",
        sku: "MILK002",
        imageUrl: "/products/p4.jpg",
      },
      {
        name: "Fresh Mango",
        slug: slugify("Fresh Mango", { lower: true }),
        description: "Juicy Alphonso mangoes, directly from farm.",
        category: categoryMap["Fruits & Vegetables"],
        price: 120,
        stock: 80,
        unit: "kg",
        sku: "MANGO001",
        imageUrl: "/products/p5.webp",
      },
      {
        name: "Pulb Mango",
        slug: slugify("Pulb Mango", { lower: true }),
        description: "Juicy Alphonso mangoes, directly from farm.",
        category: categoryMap["Fruits & Vegetables"],
        price: 220,
        stock: 80,
        unit: "kg",
        sku: "MANGO002",
        imageUrl: "/products/p6.jpg",
      },
      {
        name: "Coca Cola 2L",
        slug: slugify("Coca Cola 2L", { lower: true }),
        description: "Refreshing cold drink to energize your day.",
        category: categoryMap["Cold Drinks & Juices"],
        price: 90,
        stock: 60,
        unit: "bottle",
        sku: "COKE001",
        imageUrl: "/products/p7.jpg",
      },
      {
        name: "Coca Cola",
        slug: slugify("Coca Cola", { lower: true }),
        description: "Refreshing cold drink to energize your day.",
        category: categoryMap["Cold Drinks & Juices"],
        price: 90,
        stock: 60,
        unit: "bottle",
        sku: "COKE002",
        imageUrl: "/products/p8.webp",
      },
      {
        name: "Potato Chips",
        slug: slugify("Potato Chips", { lower: true }),
        description: "Crunchy and salty potato chips for your snacks.",
        category: categoryMap["Snacks & Munchies"],
        price: 40,
        stock: 200,
        unit: "pack",
        sku: "CHIPS001",
        imageUrl: "/products/p9.jpg",
      },
      {
        name: "Potato Chips Crispy",
        slug: slugify("Potato Chips Crispy", { lower: true }),
        description: "Crunchy and salty potato chips for your snacks.",
        category: categoryMap["Snacks & Munchies"],
        price: 100,
        stock: 100,
        unit: "pack",
        sku: "CHIPS002",
        imageUrl: "/products/p10.jpg",
      },
      {
        name: "Instant Noodles",
        slug: slugify("Instant Noodles", { lower: true }),
        description: "Quick and tasty noodles in just 2 minutes.",
        category: categoryMap["Breakfast & Instant Food"],
        price: 30,
        stock: 150,
        unit: "pack",
        sku: "NOODLES001",
        imageUrl: "/products/p11.jpg",
      },
      {
        name: "Noodles",
        slug: slugify("Noodles", { lower: true }),
        description: "Quick and tasty noodles in just 2 minutes.",
        category: categoryMap["Breakfast & Instant Food"],
        price: 100,
        stock: 200,
        unit: "pack",
        sku: "NOODLES002",
        imageUrl: "/products/p12.avif",
      },
      {
        name: "Chocolate Cake",
        slug: slugify("Chocolate Cake", { lower: true }),
        description: "Delicious soft cake with chocolate cream.",
        category: categoryMap["Bakery & Biscuits"],
        price: 250,
        stock: 20,
        unit: "pcs",
        sku: "CAKE001",
        imageUrl: "/products/p13.webp",
      },
      {
        name: "Choco Cake",
        slug: slugify("Choco Cake", { lower: true }),
        description: "Delicious soft cake with chocolate cream.",
        category: categoryMap["Bakery & Biscuits"],
        price: 350,
        stock: 50,
        unit: "pcs",
        sku: "CAKE002",
        imageUrl: "/products/p14.jpg",
      },
      {
        name: "Organic Atta 5kg",
        slug: slugify("Organic Atta 5kg", { lower: true }),
        description: "Healthy wheat flour for soft chapatis.",
        category: categoryMap["Atta, Rice & Dal"],
        price: 280,
        stock: 40,
        unit: "bag",
        sku: "ATTA001",
        imageUrl: "/products/p15.jpg",
      },
      {
        name: "Organic Atta",
        slug: slugify("Organic Atta", { lower: true }),
        description: "Healthy wheat flour for soft chapatis.",
        category: categoryMap["Atta, Rice & Dal"],
        price: 580,
        stock: 20,
        unit: "bag",
        sku: "ATTA002",
        imageUrl: "/products/p16.jpg",
      },
      {
        name: "Chicken Curry Cut 1kg",
        slug: slugify("Chicken Curry Cut 1kg", { lower: true }),
        description: "Fresh chicken cut pieces for curry.",
        category: categoryMap["Chicken, Meat & Fish"],
        price: 350,
        stock: 30,
        unit: "kg",
        sku: "CHICKEN001",
        imageUrl: "/products/p17.webp",
      },
      {
        name: "Chicken Curry Cut",
        slug: slugify("Chicken Curry Cut", { lower: true }),
        description: "Fresh chicken cut pieces for curry.",
        category: categoryMap["Chicken, Meat & Fish"],
        price: 550,
        stock: 10,
        unit: "kg",
        sku: "CHICKEN002",
        imageUrl: "/products/p18.jpg",
      },
      {
        name: "Green Tea Pack",
        slug: slugify("Green Tea Pack", { lower: true }),
        description: "Refreshing healthy green tea bags.",
        category: categoryMap["Tea, Coffee & Health Drink"],
        price: 150,
        stock: 70,
        unit: "box",
        sku: "TEA001",
        imageUrl: "/products/p19.webp",
      },
      {
        name: "Green Tea",
        slug: slugify("Green Tea", { lower: true }),
        description: "Refreshing healthy green tea bags.",
        category: categoryMap["Tea, Coffee & Health Drink"],
        price: 250,
        stock: 100,
        unit: "box",
        sku: "TEA002",
        imageUrl: "/products/p20.webp",
      },
    ];

    await Product.insertMany(products);
    const productAll = await Product.find();
    console.log({
      count: productAll.length,
      productAll,
    });
    console.log("✅ Products Seeded Successfully!");
  } catch (error) {
    console.error("Seeder Error:", error.message);
    process.exit(1);
  }
};

seedProducts();
