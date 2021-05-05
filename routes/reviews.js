const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

router.put(
  "/:id",
  catchAsync(reviews.editReview)
);

router.get(
  "/:id/edit",
  catchAsync(reviews.renderEditReviewForm)
);

module.exports = router;
