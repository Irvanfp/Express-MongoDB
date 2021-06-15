const mongoose = require("mongoose");
const validator = require("validator");
const { review, user, movie } = require("../../models");

exports.show = async (req, res, next) => {
  try {
    let errors = [];

    if (!mongoose.Types.ObjectId.isValid(req.query.movieId)) {
      errors.push(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    }
    if (!req.query.page) {
      req.query.page = "1";
    }

    if (!validator.isNumeric(req.query.page)) {
      errors.push("please specify the page");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
    let findReview = await Promise.all([
      movie.findOne({ _id: req.query.movieId }),
      review.findOne({ movie: req.query.movieId }),
    ]);

    if (!findReview[0]) {
      errors.push("movie doesn't exist");
    }

    if (!findReview[1]) {
      errors.push("no review yet");
    }

    req.body.movie = findReview[0];

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (e) {
    console.log("validator", e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
//===================================================================================================================================================
exports.share = async (req, res, next) => {
  try {
    let errors = [];

    if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
      errors.push(
        "id_user is not valid and must be 24 character & hexadecimal"
      );
    }

    if (!req.query.page) {
      req.query.page = "1";
    }

    if (!validator.isNumeric(req.query.page)) {
      errors.push("please specify the page");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    let findReview = await review.findOne({ user: req.query.userId });

    if (!findReview) {
      errors.push("user has no review");
    }

    req.body.user = findReview;
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (e) {
    console.log("validator", e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

//===================================================================================================================================================
exports.create = async (req, res, next) => {
  try {
    let errors = [];

    // if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    //   errors.push(
    //     "id_user is not valid and must be 24 character & hexadecimal"
    //   );
    // }

    if (!mongoose.Types.ObjectId.isValid(req.query.movieId)) {
      errors.push(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    }

    if (req.body.rating) {
      let x = review.schema.path("rating").options.enum;
      let n = x.includes(parseInt(req.body.rating));
      if (n === false) {
        errors.push("rating should be number 1 to 10");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    let findData = await Promise.all([
      movie.findOne({ _id: req.query.movieId }),
      user.findOne({ _id: req.user.id }),
      review.findOne({
        movie: req.query.movieId,
        user: req.user.id,
      }),
    ]).catch((err) => {
      throw ("start panic", err);
    });
    if (!findData[0]) {
      errors.push("movie not found");
    }

    // if (!findData[1]) {
    //   errors.push("user not found");
    // }

    if (findData[2]) {
      errors.push("user already reviewed ");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    req.body.movie = findData[0]._id;
    req.body.user = findData[1]._id;
    req.body.review = findData[2];

    next();
  } catch (e) {
    console.error(`validator`, e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

//===================================================================================================================================================
exports.update = async (req, res, next) => {
  try {
    let errors = [];

    if (!mongoose.Types.ObjectId.isValid(req.query.movieId)) {
      errors.push(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    }

    if (req.body.rating) {
      let x = review.schema.path("rating").options.enum;
      let n = x.includes(parseInt(req.body.rating));
      if (n === false) {
        errors.push("rating should be number 1 to 10");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    let findData = await Promise.all([
      movie.findOne({ _id: req.query.movieId }),
      user.findOne({ _id: req.user.id }),
      review.findOne({
        movie: req.query.movieId,
        user: req.user.id,
      }),
    ]).catch((err) => {
      throw ("start panic", err);
    });

    if (!findData[0]) {
      errors.push("movie not found");
    }

    if (findData[2]) {
      if (req.user.id != findData[2].user) {
        errors.push("user_id has no authorities to edit this");
      }
    } else {
      errors.push("user has not reviewed ");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    if (!req.body.tittle) {
      req.body.tittle = findData[2].tittle;
    }

    if (!req.body.content) {
      req.body.content = findData[2].content;
    }

    if (!req.body.rating) {
      req.body.rating = findData[2].rating;
    }

    req.body.movie = findData[0]._id;
    req.body.user = findData[1]._id;
    req.body.id = findData[2]._id;

    next();
  } catch (e) {
    console.error(`validator`, e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
//===================================================================================================================================================
exports.delete = async (req, res, next) => {
  try {
    let errors = [];

    if (!mongoose.Types.ObjectId.isValid(req.query.movieId)) {
      errors.push(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    let findData = await Promise.all([
      movie.findOne({ _id: req.query.movieId }),
      user.findOne({ _id: req.user.id }),
      review.findOne({
        movie: req.query.movieId,
        user: req.user.id,
      }),
    ]).catch((err) => {
      throw ("start panic", err);
    });

    if (!findData[0]) {
      errors.push("movie not found");
    }

    if (!findData[2]) {
      errors.push("user has not reviewed ");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    req.body.movie = findData[0];
    req.body.user = findData[1];
    req.body.review = findData[2]._id;

    next();
  } catch (e) {
    console.error(`validator`, e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
