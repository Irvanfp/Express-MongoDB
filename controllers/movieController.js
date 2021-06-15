const crypto = require("crypto");
const path = require("path");
const { title } = require("process");
const { createSecurePair } = require("tls");
const { movie, review, category, cast } = require("../models");
const { where } = require("../models/movie");

class MovieController {
  async getAll(req, res) {
    try {
      var page = parseInt(req.query.page) || 1; //for next page pass 1 here
      var limit = parseInt(req.query.limit) || 10;
      let search = /req.query.search\.*/ || "";
      let data = await movie
        .find({ title: { $regex: search, $options: "i" } })
        .sort({ update_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      let count = await movie.countDocuments({
        title: { $regex: search, $options: "i" },
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "Movie Not Found!",
        });
      }

      return res.status(200).json({
        message: "Success.",
        data: data,
        total: count,
        page: page,
        pageSize: data.length,
        totalPage: Math.round(count / limit),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error.",
        error: error,
      });
    }
  }
  async getOne(req, res) {
    try {
      // Find one data
      let data = await movie.findOne({
        _id: req.params.id,
      });
      console.log(data);
      // If success
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      // If failed
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
  async create(req, res) {
    try {
      // If image was uploaded

      if (req.files) {
        const file = req.files.poster;

        // Make sure image is photo
        if (!file.mimetype.startsWith("image")) {
          return res.status(400).json({ message: "File must be an image" });
        }

        // Check file size (max 1MB)
        if (file.size > 1000000) {
          return res
            .status(400)
            .json({ message: "Image must be less than 1MB" });
        }

        // Create custom filename
        let fileName = crypto.randomBytes(16).toString("hex");

        // Rename the file
        file.name = `${fileName}${path.parse(file.name).ext}`;

        // assign req.body.image with file.name
        req.body.poster = file.name;

        // Upload image to /public/images
        file.mv(`./public/images/${file.name}`, async (err) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Internal Server Error",
              error: err,
            });
          }
        });
      }

      // Create barang data
      let createdData = await movie.create(req.body);

      // find created data and join with pemasok
      let data = await movie
        .findOne({ _id: createdData._id })
        .populate("review");

      // If success
      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
  async update(req, res) {
    try {
      if (req.files) {
        const file = req.files.poster;

        // Make sure image is photo
        if (!file.mimetype.startsWith("image")) {
          return res.status(400).json({ message: "File must be an image" });
        }

        // Check file size (max 1MB)
        if (file.size > 1000000) {
          return res
            .status(400)
            .json({ message: "Image must be less than 1MB" });
        }

        // Create custom filename
        let fileName = crypto.randomBytes(16).toString("hex");

        // Rename the file
        file.name = `${fileName}${path.parse(file.name).ext}`;

        // assign req.body.image with file.name
        req.body.poster = file.name;

        // Upload image to /public/images
        file.mv(`./public/images/${file.name}`, async (err) => {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Internal Server Error",
              error: err,
            });
          }
        });
      }
      let data = await movie.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        {
          new: true,
        }
      );

      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
  async delete(req, res) {
    try {
      await movie.delete({ _id: req.params.id });

      return res.status(200).json({
        message: "Success",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
  async showMovieBy(req, res) {
    try {
      let data = await movie
        .find()
        .populate("movie")
        .where({ category: req.params.category });

      if (data.length === 0) {
        return res.status(404).json({
          message: "Movie Not Found!",
        });
      }

      return res.status(200).json({
        message: "Success.",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error.",
        error: error,
      });
    }
  }
}

module.exports = new MovieController();
