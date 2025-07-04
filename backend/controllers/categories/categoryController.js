const asyncHandler = require("express-async-handler");
const Category = require("../../models/Category/Category");

const categoryController = {
  //* ---Create category---
  createCategory: asyncHandler(async (req, res) => {
    const { categoryName, description } = req.body;
    //* chech if the category exists
    const categoryFound = await Category.findOne({ categoryName, description });
    if (categoryFound) {
      throw new Error("Category already exists");
    }
    const categoryCreated = await Category.create({
      categoryName,
      author: req.user,
    });
    res.json({
      status: "success",
      message: "Category created successfully",
      categoryCreated,
    });
  }),
  //* ---List all categories---
  fetchAllCategories: asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
      status: "success",
      message: "Category fetched successfully",
      categories,
    });
  }),
  //* ---Get a category---
  getCategory: asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const categoryFound = await Category.findById(categoryId);
    res.json({
      status: "success",
      message: "Category fetched successfully",
      categoryFound,
    });
  }),
  //* ---Delete category---
  deleteCategory: asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    await Category.findByIdAndDelete(categoryId);
    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  }),
  //* ---Update category---
  updateCategory: asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    // find the category
    const categoryFound = await Category.findById(categoryId);
    if (!categoryFound) {
      throw new Error("Category not found");
    }
    const categoryUpdated = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName: req.body.categoryName,
        description: req.body.description,
      },
      { new: true }
    );
    res.json({
      status: "Category update successfully",
      categoryUpdated,
    });
  }),
};

module.exports = categoryController;
