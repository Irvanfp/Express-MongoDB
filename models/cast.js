const mongoose = require("mongoose"); // Import Mongoose
const mongooseDelete = require("mongoose-delete"); // Import Mongoose Delete

const CastSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    image: {
      type: String,
      default: null,
      required: false,
      get: getImage, // Getter
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

// Images
function getImage(image) {
  return `/image/${image}`;
}

// Soft delete
CastSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("cast", CastSchema);
