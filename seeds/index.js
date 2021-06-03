if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const User = require("../models/user");
const Review = require("../models/review");

const db_url = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await User.deleteMany({});
  await Review.deleteMany({});
  const seedsUser = new User({
    email: "seedsUser1@gmail.com",
    username: "eneseed",
  });
  await User.register(seedsUser, process.env.SEED_USER_PASS);
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: seedsUser._id,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis dolores harum, nihil rem accusamus consequatur a amet id quisquam omnis. Facere asperiores suscipit labore maiores non nostrum, inventore harum earum?",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1622304963/YelpCamp/mowbzucetct2lqrvmfat.jpg",
          filename: "YelpCamp/mowbzucetct2lqrvmfat",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1622304963/YelpCamp/ocauduijy8gf7dfd4cdf.jpg",
          filename: "YelpCamp/ocauduijy8gf7dfd4cdf",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1622304963/YelpCamp/arwuarpv6hovflfyz9xf.jpg",
          filename: "YelpCamp/arwuarpv6hovflfyz9xf",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1621846211/YelpCamp/zmbfglagjzphr2ebefhu.jpg",
          filename: "YelpCamp/zmbfglagjzphr2ebefhu",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1621846210/YelpCamp/m4vmbkei3yymwqoz3ftj.jpg",
          filename: "m4vmbkei3yymwqoz3ftj",
        },
      ],
    });

    await camp.save();
    await User.findByIdAndUpdate(seedsUser._id, {
      $push: { campgrounds: camp },
    });
  }
};

seedDB().then(() => {
  db.close();
});
