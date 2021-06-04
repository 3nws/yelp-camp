const User = require("../models/user");
const { escapeRegex } = require("../utils/escapeRegex");

module.exports.viewRegisteredUsers = async (req, res, next) => {
  const pageNumber = req.query.page || 1;

  if (req.query.search && !req.xhr) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    User.find(
      { $or: [{ username: regex }, { email: regex }] },
      function (err, users) {
        if (err) {
          console.log(err);
        } else {
          res.render("users/index", {
            users: users.reverse(0, 20 + 1),
            num_of_pages: users.length / 20,
            pageNumber,
          });
        }
      }
    );
  } else {
    User.find({}, function (err, users) {
      if (err) {
        console.log(err);
      } else {
        if (req.xhr) {
          res.json(users);
        } else {
          res.render("users/index", {
            users: users.reverse().slice(0, 20 + 1),
            num_of_pages: users.length / 20,
            pageNumber,
          });
        }
      }
    }).populate("author");
  }
};

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.authenticate = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  if (redirectUrl == "/register") {
    res.redirect("/campgrounds");
    return;
  }
  res.redirect(redirectUrl);
};

module.exports.getProfilePage = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate("campgrounds")
    .populate({
      path: "reviews",
      populate: {
        path: "campground",
      },
    });
  res.render("users/profile", { user });
};

module.exports.editProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, {
    ...req.body.user,
  });
  if (req.files.length) {
    user.avatar.url = req.files[0].path;
    user.avatar.filename = req.files[0].filename;
  }
  await user.save();
  req.flash("success", "Successfully updated your profile!");
  res.redirect(`/profile/${user._id}`);
};

module.exports.getUserEditForm = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "No such user exists!");
    return res.redirect("/campgrounds");
  }
  res.render("users/edit", { user });
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "BYE");
  res.redirect("/campgrounds");
};
