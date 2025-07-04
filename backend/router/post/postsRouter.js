const express = require("express");
const postController = require("../../controllers/posts/postController");
const multer = require("multer");
const storage = require("../../utils/fileupload");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const checkUserPlan = require("../../middlewares/checkUserPlan");
const optionalAuth = require("../../middlewares/optionalAuth");
const isAccountVerified = require("../../middlewares/isAccountVerified");
//! multer instance
const upload = multer({ storage });

//! express router instance
const postRouter = express.Router();

//* ---Create post---
postRouter.post(
  "/create",
  isAuthenticated,
  checkUserPlan,
  isAccountVerified,
  upload.single("image"),
  postController.createPost
);

//* ---List all posts---
postRouter.get("/", postController.fetchAllPosts);

//* ---update post---
postRouter.put(
  "/:postId",
  isAuthenticated,
  upload.single("image"),
  postController.updatePost
);

//* ---get post---
postRouter.get("/:postId", optionalAuth, postController.getPost);

//* ---delete posts---
postRouter.delete("/:postId", isAuthenticated, postController.deletePost);

//* ---like post----
postRouter.put("/likes/:postId", isAuthenticated, postController.like);

//* ---dislike post----
postRouter.put("/dislikes/:postId", isAuthenticated, postController.dislike);

module.exports = postRouter;
