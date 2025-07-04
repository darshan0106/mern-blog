const express = require("express");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const earningsController = require("../../controllers/earnings/earningsController");

const earningsRouter = express.Router();

//----lists all earnings----
earningsRouter.get("/", earningsController.fetchAllEarnings);
//----User earnings----
earningsRouter.get(
  "/my-earnings",
  isAuthenticated,
  earningsController.getUserEarnings
);

module.exports = earningsRouter;
