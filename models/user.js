const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  phoneNumber: String,
  avatarUrl: { type: String, default: "https://i.ibb.co/5nsGfgk/default-Avatar.png" },
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
