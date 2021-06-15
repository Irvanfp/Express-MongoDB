const { cast } = require("../models"); // Import models

class CastController {
  // Get All Cast
  async getAll(req, res) {
    try {
      // Find All Cast Data
      let data = await cast.find();

      // If no data found
      if (data.length === 0) {
        return res.status(404).json({
          message: "No Cast Data",
        });
      }
      // If Success
      return res.status(200).json({
        message: "All Cast Data Found",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }
  // Get One Cast Data
  async getOne(req, res) {
    try {
      let data = await cast.findOne({ _id: req.params.id });

      // If no data found
      if (data.length === 0) {
        return res.status(404).json({
          message: "No Cast Data",
        });
      }
      // If Success
      return res.status(200).json({
        message: "Cast Data Found",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  // Create a new Cast
  async create(req, res) {
    try {
      let data = await cast.create(req.body);

      // If success
      return res.status(201).json({
        message: "Success Created Cast Data",
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
  // Update Cast
  async update(req, res) {
    try {
      // Update Cast Data
      let data = await cast.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body, // This is all of req.body
        {
          new: true,
          // new is to return the updated cast data
          // If there is no new, it will return the old data before updated
        }
      );

      // If success
      return res.status(201).json({
        message: "Success Updated Cast Data",
        data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  // Delete Cast
  async delete(req, res) {
    try {
      // Delete Cast Data
      await cast.delete({ _id: req.params.id });

      return res.status(200).json({
        message: "Cast Data Has Been Deleted",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
}

module.exports = new CastController();
