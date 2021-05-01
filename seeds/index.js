const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
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
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const today = new Date().toLocaleString();
    const camp = new Campground({
      author: "6076d8f625c2832388add0f1",
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
      dateCreated: today,
      images: [
        {
          url:
            "https://res.cloudinary.com/dlgcegblt/image/upload/v1619896342/YelpCamp/qzhp5q7udibh9fvb1ac1.jpg",
          filename: "YelpCamp/qzhp5q7udibh9fvb1ac1",
        },
        {
          url:
            "https://res.cloudinary.com/dlgcegblt/image/upload/v1619896343/YelpCamp/auxskfd8zodw6sioktkl.jpg",
          filename: "YelpCamp/auxskfd8zodw6sioktkl",
        },
        {
          url:
            "https://res.cloudinary.com/dlgcegblt/image/upload/v1619896344/YelpCamp/sdltawwdlq6jcbfweylv.jpg",
          filename: "YelpCamp/sdltawwdlq6jcbfweylv",
        },
      ],
    });

    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
