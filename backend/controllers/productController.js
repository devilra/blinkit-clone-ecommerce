const slugify = require("slugify");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Get all products (with filter, search, sort, pagination)
// @route   GET /api/products
// @access  Public

exports.getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    //console.log(category);

    let filter = {};

    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (category) {
      const cat = await Category.findOne({ slug: category });

      if (cat) filter.category = cat._id;
    }

    const sortOptions = {};

    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    //console.log("Query slug:", category);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin

exports.createProduct = async (req, res) => {
  //console.log("create product running");
  try {
    const { name, description, category, price, stock, unit } = req.body;

    const slug = slugify(name, { lower: true });
    const productExists = await Product.findOne({ slug });

    if (productExists) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const categoryDoc = await Category.findById(category);
    console.log(categoryDoc);

    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const count = await Product.countDocuments({ category });
    const sku = `${categoryDoc.slug}-${count + 1}`.toUpperCase();

    // SKU auto-generate (unique)
    // const count = await Product.countDocuments({ category });
    // const sku = `${category}-${count + 1}`;

    // Example: fried-paan-1, fried-paan-2
    // if you want simple unique: const sku = `PROD-${Date.now()}`;

    // main image (single)
    let mainImageUrl = null;
    if (req.files && req.files.image && req.files.image[0]) {
      mainImageUrl = await uploadToCloudinary(
        req.files.image[0].buffer,
        "products/main"
      );
    }

    let galleryUrls = [];
    if (req.files && req.files.gallery) {
      for (const file of req.files.gallery) {
        const url = await uploadToCloudinary(file.buffer, "products/gallery");
        galleryUrls.push(url);
      }
    }

    // console.log("main image Url,", mainImageUrl);
    // console.log("galleryUrl,", galleryUrls);
    console.log("sku,", sku);

    const product = new Product({
      name,
      slug,
      description,
      category,
      price,
      stock,
      unit,
      sku,
      imageUrl: mainImageUrl,
      gallery: galleryUrls,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, unit, status } =
      req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update basic fields
    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true });
    }

    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (unit !== undefined) product.unit = unit;
    //if (sku !== undefined) product.sku = sku;
    if (status !== undefined) product.status = status;

    // 🔥 Main image update

    if (req.files && req.files.image && req.files.image[0]) {
      const newMainImage = await uploadToCloudinary(
        req.files.image[0].buffer,
        "products/main"
      );
      product.imageUrl = newMainImage;
    }

    // 🔥 Gallery update (replace existing gallery if new files uploaded)
    if (req.files && req.files.gallery) {
      let newGalleryUrls = [];
      for (const file of req.files.gallery) {
        const url = await uploadToCloudinary(file.buffer, "products/gallery");
        newGalleryUrls.push(url);
      }
      product.gallery = newGalleryUrls; // overwrite old gallery
    }
    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.reviewCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public

exports.getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .sort({ rating: -1 })
      .limit(5)
      .populate("category", "name slug");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
