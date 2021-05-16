const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: { String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dateCreated: { type: Date, default: Date.now },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    rateAvg: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  opts
);

CampgroundSchema.virtual("properties.popUp").get(function () {
  return `
  <strong>
    <a href="/campgrounds/${this._id}" style="text-decoration: none;">
      ${this.title}
    </a>
  </strong>
  <p>${this.description.substring(0, 30)}...</p>
  `;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
