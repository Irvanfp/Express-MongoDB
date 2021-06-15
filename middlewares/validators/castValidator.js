const crypto = require("crypto"); // Import crypto
const path = require("path");
const mongoose = require("mongoose"); // Import Mongoose
const validator = require("validator"); // Import Validator
const { cast, review, movie, user } = require("../../models"); // Import Models

exports.getOne = async (req, res, next) => {
  const errors = [];
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      errors.push(
        "Parameter is not valid and must be 24 character & hexadecimal"
      );
    }

    const findData = await cast.findOne({
      _id: req.params.id,
    });

    if (!findData) {
      errors.push("Data Not Found");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error in Validator",
      error: e,
    });
  }
};

exports.create = async (req, res, next) => {
  const errors = [];
  try {
    // Validate must be alphabet
    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Cast name must be alphabet");
    }
    console.log(req.body);
    const findData = await cast.findOne({
      where: req.body.name,
    });
    if (findData) {
      errors.push("Cast name already exist");
    }
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
    // If image was uploaded
    if (req.files) {
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.image = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Internal Server Error in Upload",
            error: err.message,
          });
        }
      });
    }

    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error in Validator",
    });
  }
};

exports.update = async (req, res, next) => {
  const errors = [];
  try {
    // Validate must be alphabet
    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Cast name must be alphabet");
    }
    const findData = await cast.findOne({
      where: req.body.name,
    });
    if (findData) {
      errors.push("Cast name already exist");
    }
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
    // If image was uploaded
    if (req.files) {
      const file = req.files.image;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
      }

      // Create custom filename
      let fileName = crypto.randomBytes(16).toString("hex");

      // Rename the file
      file.name = `${fileName}${path.parse(file.name).ext}`;

      // assign req.body.image with file.name
      req.body.image = file.name;

      // Upload image to /public/images
      file.mv(`./public/images/${file.name}`, async (err) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Internal Server Error in Upload",
            error: err.message,
          });
        }
      });
    }

    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal Server Error in Validator",
    });
  }
};

exports.delete = async (req, res, next) => {
  const errors = [];
  try {
    // Validate Parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      errors.push(
        "Parameter is not valid and must be 24 character & hexadecimal"
      );
    }

    const findData = await cast.findOne({
      _id: req.params.id,
    });

    if (!findData) {
      errors.push("Data Not Found");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error in Validator",
      error: e,
    });
  }
};
