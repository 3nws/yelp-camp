const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_48");
});

const UserSchema = new Schema({
  phoneNumber: String,
  avatar: {
    type: ImageSchema,
    default: {
      url: "https://i.ibb.co/5nsGfgk/default-Avatar.png",
      filename: "defaultAvatar1",
    },
  },
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  campgrounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  ],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  dateRegistered: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
