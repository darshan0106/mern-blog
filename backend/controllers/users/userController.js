const asyncHandler = require("express-async-handler");
const User = require("../../models/User/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userController = {
  //! Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    //* Check if username already exist
    const userFound = await User.findOne({ username, email });
    if (userFound) {
      throw new Error("User already exists");
    }
    //* Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //* Register the user
    const userRegistered = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //* send the response
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      userRegistered,
    });
  }),
  //! Login
  login: asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      //* check if user not found
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      //* generate token
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET);
      //* set the token into cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1day
      });
      //* send the response
      res.json({
        status: "success",
        message: "Login success",
        username: user?.username,
        email: user?.email,
        _id: user?._id,
      });
    })(req, res, next);
  }),
  //! googleAuth
  googleAuth: passport.authenticate("google", { scope: ["profile"] }),
  //! googleAuthCallback
  googleAuthCallback: asyncHandler(async (req, res, next) => {
    passport.authenticate(
      "google",
      {
        failureRedirect: "/login",
        session: false,
      },
      (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("http://localhost:5173/google-login-error");
        }
        //* jwt token
        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
        //* set token to cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
        //* redirect to dashboard
        res.redirect("http://localhost:5173/dashboard");
      }
    )(req, res, next);
  }),
  //! check user authenticated
  checkAuthenticated: asyncHandler(async (req, res) => {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ isAuthenticated: false });
      } else {
        return res.status(200).json({
          isAuthenticated: true,
          _id: user?._id,
          username: user?.username,
          profilePicture: user?.profilePicture,
        });
      }
    } catch (error) {
      return res.error(401).json({ isAuthenticated: false });
    }
  }),
  //! logout
  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout success" });
  }),
};

module.exports = userController;
