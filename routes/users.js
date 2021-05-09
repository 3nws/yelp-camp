const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware"); // TODO ADD THIS LATER
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.authenticate
  );

router.get("/profile", catchAsync(users.getProfilePage));

router.get("/logout", users.logoutUser);

module.exports = router;
