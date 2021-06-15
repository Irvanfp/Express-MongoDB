const crypto = require("crypto");
const path = require("path");
const { user } = require("../../models/");
const validator = require("validator");

module.exports.signup = async (req, res, next) => {
  let errors = [];

  if (validator.isNumeric(req.body.fullname)) {
    errors.push("Please input valid letters");
  }
  if (validator.isNumeric(req.body.username)) {
    errors.push("Please input valid letters");
  }
  if (!validator.isEmail(req.body.email)) {
    errors.push("Please input valid email");
  }
  if (!validator.isStrongPassword(req.body.password)) {
    errors.push(
      "Password must have minimum length of 8 characters with minimum 1 lowercase character, 1 uppercase character, 1 number and 1 symbol"
    );
  }

  if (req.body.confirmpassword !== req.body.password) {
    errors.push("Password confirmation must be the same with password");
  }
  // If errors length > 0, it will make errors message
  if (errors.length > 0) {
    // Because bad request
    return res.status(400).json({
      message: errors.join(", and "),
    });
  }
  // It means that will be go to the next middleware
  next();
};

module.exports.login = async (req, res, next) => {
  let errors = [];

  if (!validator.isEmail(req.body.email)) {
    errors.push("Please input valid email");
  }
  if (!validator.isStrongPassword(req.body.password)) {
    errors.push(
      "Password must have minimum length of 8 characters with minimum 1 lowercase character, 1 uppercase character, 1 number and 1 symbol"
    );
  }

  // If errors length > 0, it will make errors message
  if (errors.length > 0) {
    // Because bad request
    return res.status(400).json({
      message: errors.join(", and "),
    });
  }
  // It means that will be go to the next middleware
  next();
};
