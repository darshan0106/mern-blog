require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const postRouter = require("./router/post/postsRouter");
const usersRouter = require("./router/user/usersRouter");
const passport = require("./utils/passport-config");
const categoriesRouter = require("./router/category/categoriesRouter");
// * calling connection function
connectDB();

const app = express();

//! PORT
const PORT = 5000;

//Middlewares
app.use(express.json()); //Pass json data
//cors middleware
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

//! passport middleware
app.use(passport.initialize());
app.use(cookieParser());

//! Route haandlers
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);

//! Not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found on our server" });
});

// ! Error handling midleware
app.use((err, req, res, next) => {
  const message = err.message;
  const stack = err.stack;
  res.status(500).json({
    message,
    stack,
  });
});

//! Start
app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
