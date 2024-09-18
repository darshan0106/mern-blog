const asyncHandler = require("express-async-handler");
const Post = require("../../models/Post/Post");

const postController = {
  //* ---Create post---
  createPost: asyncHandler(async (req, res) => {
    console.log(req.file);
    //get the payload
    const { description } = req.body;

    const postCreated = await Post.create({
      description,
      image: req.file,
      author: req.user,
    });
    res.json({
      status: "success",
      message: "Post created successfully",
      postCreated,
    });
  }),
  //* ---List all posts---
  fetchAllPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.json({
      status: "success",
      message: "Post fetched successfully",
      posts,
    });
  }),
  //* ---Get a post---
  getPost: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const postFound = await Post.findById(postId);
    res.json({
      status: "success",
      message: "Post fetched successfully",
      postFound,
    });
  }),
  //* ---Delete post---
  deletePost: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    await Post.findByIdAndDelete(postId);
    res.json({
      status: "success",
      message: "Post deleted successfully",
    });
  }),
  //* ---Update post---
  updatePost: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    // find the post
    const postFound = await Post.findById(postId);
    if (!postFound) {
      throw new Error("Post not found");
    }
    const postUpdated = await Post.findByIdAndUpdate(
      postId,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
    res.json({
      status: "Post update successfully",
      postUpdated,
    });
  }),
};

module.exports = postController;
