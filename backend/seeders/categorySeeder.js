const mongoose = require("mongoose");
const slugify = require("slugify");
const dotenv = require("dotenv");
const Category = require("../models/Category");

dotenv.config();
MONGO_URI =
  "mongodb+srv://raja:raja@cluster0.cdldg3o.mongodb.net/naatusarkarai";

console.log("MONGO_URI =", MONGO_URI);

const categories = [
  "Paan Corner",
  "Dairy, Bread & Eggs",
  "Fruits & Vegetables",
  "Cold Drinks & Juices",
  "Snacks & Munchies",
  "Breakfast & Instant Food",
  "Sweet Tooth",
  "Bakery & Biscuits",
  "Tea, Coffee & Health Drink",
  "Atta, Rice & Dal",
  "Masala, Oil & More",
  "Sauces & Spreads",
  "Chicken, Meat & Fish",
  "Organic & Healthy Living",
  "Baby Care",
  "Pharma & Wellness",
  "Cleaning Essentials",
  "Home & Office",
  "Personal Care",
  "Pet Care",
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connected Success");
  } catch (error) {
    console.log(error.message);
  }
};

const importCategories = async () => {
  try {
    await connectDB();
    await Category.deleteMany(); // old categories remove

    const createdCategories = categories.map((name) => ({
      name,
      slug: slugify(name.toLowerCase()),
    }));
    const result = await Category.insertMany(createdCategories);
    console.log(`✅ Categories imported successfully: ${result.length} items`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importCategories();
