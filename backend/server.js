require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cron = require("node-cron");
const connectDB = require("./utils/connectDB");
const postRouter = require("./router/post/postsRouter");
const usersRouter = require("./router/user/usersRouter");
const passport = require("./utils/passport-config");
const categoriesRouter = require("./router/category/categoriesRouter");
const planRouter = require("./router/plan/planRouter");
const stripePaymentRouter = require("./router/stripePayment/stripePaymentRouter");
const calculateEarnings = require("./utils/calculateEarnings");
const earningsRouter = require("./router/earnings/earningsRouter");
const notificationRouter = require("./router/notification/notificationRouter");
const commentRouter = require("./router/comments/commentRouter");
// * calling connection function
connectDB();

//Schedule the task to run at 23:59 on the last day of every month
cron.schedule(
  "59 23 * * * ",
  async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (today.getMonth() !== tomorrow.getMonth()) {
      calculateEarnings(); //calc earnings
    }
  },
  {
    scheduled: true,
    timezone: "Asia/kolkata",
  }
);

const app = express();

//! PORT
const PORT = 5000;

//Middlewares
app.use(express.json()); //Pass json data
//cors middleware
const corsOptions = {
  origin: ["https://mern-blog-darshan0106s-projects.vercel.app/"],
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
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/stripe", stripePaymentRouter);
app.use("/api/v1/earnings", earningsRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/comments", commentRouter);

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
