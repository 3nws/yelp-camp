const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.get("/", function (req, res) {
  Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      options: { sort: { createdAt: -1 } }, // sorting the populated reviews array to show the latest first
    })
    .exec(function (err, campground) {
      if (err || !campground) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      res.render("reviews/index", { campground: campground });
    });
});

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
