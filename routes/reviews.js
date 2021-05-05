const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const multer = require("multer");

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
  isReviewAuthorEdit,
} = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

router.put(
  "/:id",
  multer().array(),
  isLoggedIn,
  isReviewAuthorEdit,
  catchAsync(reviews.editReview)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isReviewAuthorEdit,
  catchAsync(reviews.renderEditReviewForm)
);

module.exports = router;
