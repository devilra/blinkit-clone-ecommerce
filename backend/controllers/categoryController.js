const slugify = require("slugify");
const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate(
      "parentCategory",
      "name slug"
    );
    res.json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = await Category.findById(id);
    console.log(categoryId);
    const category = await Category.findById(id).populate(
      "parentCategory",
      "name slug"
    );
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, parentCategory, image, isFeatured, status } = req.body;
    const slug = slugify(name, { lower: true });
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      slug,
      parentCategory: parentCategory || null,
      image,
      isFeatured,
      status,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, parentCategory, image, isFeatured, status } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true });
    }

    if (parentCategory !== undefined)
      category.parentCategory = parentCategory || null;
    if (image !== undefined) category.image = image;
    if (isFeatured !== undefined) category.isFeatured = isFeatured;
    if (status !== undefined) category.status = status;

    await category.save();

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Products by Parent Category (Snacks -> Chips, Mixtures)
exports.getProductsByParentCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const parentCategory = await Category.findOne({ slug });
    if (!parentCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const childCategories = await Category.find({
      parentCategory: parentCategory._id,
    });
    const childIds = childCategories.map((cat) => cat._id);

    // include both parent products + child products
    const products = await Product.find({
      category: { $in: [parentCategory._id, ...childIds] },
    });

    res.json({
      parentCategory: parentCategory.name,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
