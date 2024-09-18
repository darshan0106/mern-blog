const express = require("express");
const postController = require("../../controllers/posts/postController");
const multer = require("multer");
const storage = require("../../utils/fileupload");
const isAuthenticated = require("../../middlewares/isAuthenticated");

//! multer instance
const upload = multer({ storage });

//! express router instance
const postRouter = express.Router();

//* ---Create post---
postRouter.post(
  "/create",
  isAuthenticated,
  upload.single("image"),
  postController.createPost
);

//* ---List all posts---
postRouter.get("/", postController.fetchAllPosts);

//* ---update post---
postRouter.put("/:postId", isAuthenticated, postController.updatePost);

//* ---get post---
postRouter.get("/:postId", postController.getPost);

//* ---delete posts---
postRouter.delete("/:postId", isAuthenticated, postController.deletePost);

module.exports = postRouter;
