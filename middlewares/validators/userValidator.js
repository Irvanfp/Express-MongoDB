const mongoose = require("mongoose");
const validator = require("validator");
const { user } = require("../../models");

module.exports.getOne = (req, res, next) => {
  // Check parameter is valid or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "User ID is not valid and must be 24 character & hexadecimal",
    });
  }

  next();
};

module.exports.update = async (req, res, next) => {
  let errors = [];

  // Check parameter id is valid or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    errors.push("User ID is not valid and must be 24 character & hexadecimal");
  }

  // Find user
  let findData = await user.findOne({ _id: req.params.id });

  // if user not found
  if (!findData) {
    errors.push("user not found");
  }

  // If error
  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }
  // Go to next
  next();
};
