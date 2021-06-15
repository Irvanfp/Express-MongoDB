const mongoose = require("mongoose");
const validator = require("validator");
const { movie, review, cast, category } = require("../../models");

exports.create = async (req, res, next) => {
  // Initialita
  let errors = [];
  console.log(req.body);

  for (let i = 0; i < req.body.cast.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(req.body.cast[i])) {
      errors.push(
        "id_cast is not valid and must be 24 character & hexadecimal"
      );
    }
    if (req.body.cast[i] == req.body.cast[i + 1]) {
      errors.push("Same Cast");
    }
    let dataCast = await cast.findOne({ _id: req.body.cast[i] });
    if (!dataCast) {
      errors.push("Cast not found");
    }
  }
  for (let i = 0; i < req.body.category.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(req.body.category[i])) {
      errors.push(
        "id_category is not valid and must be 24 character & hexadecimal"
      );
    }
    if (req.body.category[i] == req.body.category[i + 1]) {
      errors.push("Same Category");
    }
    let dataCategory = await category.findOne({ _id: req.body.category[i] });
    if (!dataCategory) {
      errors.push("Category not found");
    }
  }

  // If params error
  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  // Check rating is number
  if (!validator.isNumeric(req.body.rating)) {
    errors.push("Rating must be a number");
  }

  // If errors length > 0, it will make errors message
  if (errors.length > 0) {
    // Because bad request
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  req.body.cast = req.body.cast;
  req.body.category = req.body.category;

  // It means that will be go to the next middleware
  next();
};

exports.update = async (req, res, next) => {
  // Initialita
  let errors = [];
  console.log(req.body);
  // Check id_pemasok
  for (let i = 0; i < req.body.cast.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(req.body.cast[i])) {
      errors.push(
        "id_cast is not valid and must be 24 character & hexadecimal"
      );
    }
    if (req.body.cast[i] == req.body.cast[i + 1]) {
      errors.push("Same Cast");
    }
    let dataCast = await cast.findOne({ _id: req.body.cast[i] });
    if (!dataCast) {
      errors.push("Cast not found");
    }
  }
  for (let i = 0; i < req.body.category.length; i++) {
    if (!mongoose.Types.ObjectId.isValid(req.body.category[i])) {
      errors.push(
        "id_category is not valid and must be 24 character & hexadecimal"
      );
    }
    if (req.body.category[i] == req.body.category[i + 1]) {
      errors.push("Same Category");
    }
    let dataCategory = await category.findOne({ _id: req.body.category[i] });
    if (!dataCategory) {
      errors.push("Category not found");
    }
  }
  // If params error
  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  // Check rating is number
  if (!validator.isNumeric(req.body.rating)) {
    errors.push("Rating must be a number");
  }

  // If errors length > 0, it will make errors message
  if (errors.length > 0) {
    // Because bad request
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  req.body.cast = req.body.cast;
  req.body.category = req.body.category;

  // It means that will be go to the next middleware
  next();
};

module.exports.getOne = async (req, res, next) => {
  let error = [];

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    error.push("params is not hexadecimal");
  }

  if (error.length > 0) {
    return res.status(400).json({
      message: error.join(", "),
    });
  }

  next();
};

exports.delete = async (req, res, next) => {
  let errors = [];

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    errors.push("id_movie is not valid and must be 24 character & hexadecimal");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  let data = await movie.findOne({ _id: req.params.id });

  if (!data) {
    errors.push("Movie not found");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(", "),
    });
  }

  next();
};
