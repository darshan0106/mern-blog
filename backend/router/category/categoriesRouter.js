const express = require("express");
const categoryController = require("../../controllers/categories/categoryController");
const isAuthenticated = require("../../middlewares/isAuthenticated");

//! express router instance
const categoriesRouter = express.Router();

//* ---Create category---
categoriesRouter.post(
  "/create",
  isAuthenticated,
  categoryController.createCategory
);

//* ---List all categories---
categoriesRouter.get("/", categoryController.fetchAllCategories);

//* ---update category---
categoriesRouter.put(
  "/:categoryId",
  isAuthenticated,
  categoryController.updateCategory
);

//* ---get category---
categoriesRouter.get("/:categoryId", categoryController.getCategory);

//* ---delete category---
categoriesRouter.delete(
  "/:categoryId",
  isAuthenticated,
  categoryController.deleteCategory
);

module.exports = categoriesRouter;
