const Campground = require("../models/campground");
const User = require("../models/user");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mbxToken });

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function paginationHandler(campgrounds) {
  return {
    campgrounds: campgrounds.reverse(),
    num_of_pages: campgrounds.length / 20,
  };
}

module.exports.renderFullMap = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/map", { campgrounds });
};

module.exports.index = async (req, res, next) => {
  if (req.query.search && !req.xhr) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Campground.find(
      { $or: [{ title: regex }, { location: regex }] },
      function (err, allCampgrounds) {
        if (err) {
          console.log(err);
        } else {
          res.render("campgrounds/index", paginationHandler(allCampgrounds));
        }
      }
    ).populate("author");
  } else if (req.query.sortby) {
    if (req.query.sortby === "rateAvg") {
      Campground.find({})
        .sort({
          rateAvg: 1,
        })
        .populate("author")
        .exec(function (err, allCampgrounds) {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/index", paginationHandler(allCampgrounds));
          }
        });
    } else if (req.query.sortby === "total") {
      Campground.find({})
        .sort({
          total: 1,
        })
        .populate("author")
        .exec(function (err, allCampgrounds) {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/index", paginationHandler(allCampgrounds));
          }
        });
    } else if (req.query.sortby === "priceLow") {
      Campground.find({})
        .sort({
          price: 1,
          rateAvg: -1,
        })
        .populate("author")
        .exec(function (err, allCampgrounds) {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/index", paginationHandler(allCampgrounds));
          }
        });
    } else {
      Campground.find({})
        .sort({
          price: -1,
          rateAvg: -1,
        })
        .populate("author")
        .exec(function (err, allCampgrounds) {
          if (err) {
            console.log(err);
          } else {
            res.render("campgrounds/index", paginationHandler(allCampgrounds));
          }
        });
    }
  } else if (req.query.page) {
    const pageNumber = req.query.page;
    Campground.find({})
      .populate("author")
      .exec(function (err, allCampgrounds) {
        if (err) {
          console.log(err);
        } else {
          res.render("campgrounds/index", {
            campgrounds: allCampgrounds
              .reverse()
              .slice(20 * (pageNumber - 1), 20 * pageNumber + 1),
            num_of_pages: allCampgrounds.length / 20,
          });
        }
      });
  } else {
    Campground.find({}, function (err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        if (req.xhr) {
          res.json(allCampgrounds);
        } else {
          res.render("campgrounds/index", {
            campgrounds: allCampgrounds.reverse().slice(0, 20 + 1),
            num_of_pages: allCampgrounds.length / 20,
          });
        }
      }
    }).populate("author");
  }
};

module.exports.renderNewCampgroundForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  //TO DO check if the location exists
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  await User.findByIdAndUpdate(campground.author, {
    $push: { campgrounds: campground },
  });
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.viewCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "No such campground exists!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditCampgroundForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "No such campground exists!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission for that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};
