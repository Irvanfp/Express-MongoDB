const mongoose = require("mongoose"); // Import Mongoose
const mongooseDelete = require("mongoose-delete"); // Import Mongoose Delete

const CategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      unique: true,
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

// Soft delete
CategorySchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("category", CategorySchema, "category");
