const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const mongooseUrl = require("mongoose-type-url");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    trailer: {
      type: mongoose.SchemaTypes.Url,
      required: true,
    },
    poster: {
      type: String,
      default: null,
      required: true,
      get: getImage,
    },
    rating: {
      type: Number,
      default: 0,
      required: false,
    },
    cast: {
      type: [mongoose.Schema.ObjectId],
      ref: "cast",
      required: true,
    },
    category: {
      type: [mongoose.Schema.ObjectId],
      ref: "category",
      required: true,
    },
  },
  {
    //enable timestamps
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { getters: true },
  }
);
//getter function for barang
function getImage(image) {
  return `/images/${image}`;
}

//enable soft delete
MovieSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("movie", MovieSchema, "movie"); //blkg untuk penamaan tabel
