const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const {
  registerRouteHandler,
  logoutRouteHandler,
  isLoggedIn,
  isOwner,
} = require("../middleware");
const users = require("../controllers/users");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

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

router
  .route("/profile/:id")
  .get(catchAsync(users.getProfilePage))
  .put(upload.array("user[avatar]"), catchAsync(users.editProfile));

router.get("/profile/:id", catchAsync(users.getProfilePage));

router.get("/profile/:id/edit", isLoggedIn, users.getUserEditForm);

router.get("/logout", logoutRouteHandler, users.logoutUser);

module.exports = router;
