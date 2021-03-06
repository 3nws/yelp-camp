const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const User = require("./models/user");

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in for that!");
    return res.redirect("/login");
  }
  next();
};

module.exports.registerRouteHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in!");
    return res.redirect("/campgrounds");
  }
  next();
};

module.exports.logoutRouteHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission for that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  if (id.toLocaleString() !== req.user._id.toLocaleString()) {
    req.flash("error", "You don't have permission for that!");
    return res.redirect(`/profile/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission for that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthorEdit = async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission for that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
