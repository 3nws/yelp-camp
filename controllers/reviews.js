const Review = require("../models/review");
const Campground = require("../models/campground");
const review = require("../models/review");

module.exports.postReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  const today = new Date().toLocaleString();
  review.datePosted = today;
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
<<<<<<< Updated upstream
  res.redirect(`/campgrounds/${id}`);
=======
  res.redirect(`/reviews/${id}`);
};

module.exports.renderEditReviewForm = async (req, res, next) => {
  Review.findById(req.params.review_id, function (err, foundReview) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    res.render("reviews/edit", {
      campground_id: req.params.id,
      review: foundReview,
    });
  });
};

module.exports.editReview = async (req, res, next) => {
  Review.findByIdAndUpdate(
    req.params.review_id,
    req.body.review,
    { new: true },
    function (err, updatedReview) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      Campground.findById(req.params.id)
        .populate("reviews")
        .exec(function (err, campground) {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
          //save changes
          campground.save();
          req.flash("success", "Your review was successfully edited.");
          res.redirect("/campgrounds/" + campground._id);
        });
    }
  );
>>>>>>> Stashed changes
};
