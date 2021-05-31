const User = require("../models/user");

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
    .populate("reviews");
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
