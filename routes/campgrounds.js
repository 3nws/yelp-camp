const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("campground[image]"),
    validateCampground,
    catchAsync(campgrounds.createNewCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewCampgroundForm);

router.get("/full-map", campgrounds.renderFullMap);

router
  .route("/:id")
  .get(catchAsync(campgrounds.viewCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("campground[image]"),
    validateCampground,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditCampgroundForm)
);

module.exports = router;
