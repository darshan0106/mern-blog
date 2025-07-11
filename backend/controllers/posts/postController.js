const asyncHandler = require("express-async-handler");
const Post = require("../../models/Post/Post");
const Category = require("../../models/Category/Category");
const User = require("../../models/User/User");
const Notification = require("../../models/Notification/Notification");
const sendNotificatiomMsg = require("../../utils/sendNotificationMsg");

const postController = {
  //* ---Create post---
  createPost: asyncHandler(async (req, res) => {
    //* get the payload
    const { description, category } = req.body;
    //* find the category
    const categoryFound = await Category.findById(category);
    if (!categoryFound) {
      throw new Error("Category not found");
    }
    //* find the user
    const userFound = await User.findById(req.user);
    if (!userFound) {
      throw new Error("User not found");
    }

    const postCreated = await Post.create({
      description,
      image: req.file,
      author: req.user,
      category,
    });
    //* push the post into category
    categoryFound.posts.push(postCreated?._id);
    await categoryFound.save();
    //* push the post into user
    userFound.posts.push(postCreated?._id);
    //* Update the user account type
    await userFound.updateAccountType();
    await userFound.save();

    //* create notification
    await Notification.create({
      userId: req.user,
      postId: postCreated._id,
      message: `New post created by ${userFound.username}`,
    });

    //* send email to followers
    userFound.followers.forEach(async (follower) => {
      const users = await User.find({ _id: follower });
      users.forEach((user) => {
        sendNotificatiomMsg(user.email, postCreated._id);
      });
    });

    res.json({
      status: "success",
      message: "Post created successfully",
      postCreated,
    });
  }),
  //* ---List all posts---
  fetchAllPosts: asyncHandler(async (req, res) => {
    //* basic filter
    const { category, title, page = 1, limit = 300 } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (title) {
      filter.description = { $regex: title, $options: "i" };
    }
    const posts = await Post.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments(filter);
    res.json({
      status: "success",
      message: "Post fetched successfully",
      posts,
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(totalPosts / limit),
    });
  }),
  //* ---Get a post---
  getPost: asyncHandler(async (req, res) => {
    //get the post id from params
    const postId = req.params.postId;
    //check for login user
    const userId = req.user ? req.user : null;
    //find the post
    const postFound = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "author",
      },
    });
    if (!postFound) {
      throw new Error("Post not found");
    }
    if (userId) {
      //check if user has viewed this post
      await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { viewers: userId },
        },
        {
          new: true,
        }
      );
    }
    res.json({
      status: "success",
      message: "Post fetched successfully",
      postFound,
    });
  }),
  //* ---Delete post---
  deletePost: asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    // const categoryId = await Post.find(postId, "category");
    // await Category.updateOne({ _id: categoryId }, { $pull: { posts: postId } }); 
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
      { description: req.body.description, image: req.file },
      { new: true }
    );
    res.json({
      status: "Post update successfully",
      postUpdated,
    });
  }),
  //* like post
  like: asyncHandler(async (req, res) => {
    //Post id
    const postId = req.params.postId;
    //user liking a post
    const userId = req.user;
    //Find the post
    const post = await Post.findById(postId);
    //Check if a user has already disliked the post
    if (post?.dislikes.includes(userId)) {
      post?.dislikes?.pull(userId);
    }
    //Check if a user has already liked the post
    if (post?.likes.includes(userId)) {
      post?.likes?.pull(userId);
    } else {
      post?.likes?.push(userId);
    }
    //resave the post
    await post.save();
    //send the response
    res.json({
      message: "Post Liked",
    });
  }),
  //* dislike post
  dislike: asyncHandler(async (req, res) => {
    //Post id
    const postId = req.params.postId;
    //user liking a post
    const userId = req.user;
    //Find the post
    const post = await Post.findById(postId);
    //Check if a user has already liked the post
    if (post?.likes.includes(userId)) {
      post?.likes?.pull(userId);
    }
    //Check if a user has already disliked the post
    if (post?.dislikes.includes(userId)) {
      post?.dislikes?.pull(userId);
    } else {
      post?.dislikes?.push(userId);
    }
    //resave the post
    await post.save();
    //send the response
    res.json({
      message: "Post Disliked",
    });
  }),
};

module.exports = postController;
