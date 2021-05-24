const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { registerRouteHandler, logoutRouteHandler } = require("../middleware"); // TODO ADD THIS LATER
const users = require("../controllers/users");

router
  .route("/register")
  .get(registerRouteHandler, users.renderRegisterForm)
  .post(registerRouteHandler, catchAsync(users.registerUser));

router
  .route("/login")
  .get(registerRouteHandler, users.renderLoginForm)
  .post(
    registerRouteHandler,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.authenticate
  );

router.get("/profile/:id", catchAsync(users.getProfilePage));

router.get("/logout", logoutRouteHandler, users.logoutUser);

module.exports = router;
