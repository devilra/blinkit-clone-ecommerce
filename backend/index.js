const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://blinkit-clone-ecommerce.vercel.app",
    ], // frontend URL
    credentials: true, // cookies/credentials allow
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// DB Connection
// connectDB();

// Routes;
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
