const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const mongoosePaginate = require("mongoose-paginate-v2");

const reviewSchema = new mongoose.Schema(
  {
    tittle: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      default: 1,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    movie: {
      type: mongoose.Schema.ObjectId,
      ref: "movie",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { getters: true },
  }
);

reviewSchema.plugin(mongoosePaginate);
reviewSchema.plugin(mongooseDelete, { overrideMethods: "all" });
reviewSchema.statics.getAverageRating = async function (movieId) {
  // console.log(`movieId`,movieId);
  let obj = await this.aggregate([
    {
      $match: { movie: movieId },
    },
    {
      $group: {
        _id: "$movie",
        rating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("movie").findByIdAndUpdate(movieId, {
      rating: obj[0].rating,
    });
  } catch (e) {
    console.error(`model`, e);
  }
};

// call getAverageCost after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.movie);
});

// call getAverageCost after remove
reviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.movie);
});

module.exports = mongoose.model("review", reviewSchema);
