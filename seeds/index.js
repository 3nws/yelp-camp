const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

const db_url = process.env.DB_URL;

mongoose.connect(db_url , {
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
    const camp = new Campground({
      author: "60a8078cf3628a367c5f9baa",
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
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1621712289/YelpCamp/qtvtykt1fzfohob7vi9h.jpg",
          filename: "YelpCamp/qtvtykt1fzfohob7vi9h",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1621712289/YelpCamp/pwl2oikihakclvhf4tiu.jpg",
          filename: "YelpCamp/pwl2oikihakclvhf4tiu",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1621712289/YelpCamp/rmlus8kzbnnguicadffg.jpg",
          filename: "YelpCamp/rmlus8kzbnnguicadffg",
        },
        {
          url: "https://res.cloudinary.com/dlgcegblt/image/upload/v1621712289/YelpCamp/zahwbcq7e6n7ae6c8aj7.jpg",
          filename: "YelpCamp/zahwbcq7e6n7ae6c8aj7",
        },
      ],
    });

    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
