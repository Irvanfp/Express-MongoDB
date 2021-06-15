const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    throw err;
  });

const review = require("./review");
const user = require("./user");
const movie = require("./movie");

module.exports = { review, user, movie };
