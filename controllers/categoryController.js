const { category } = require("../models"); // Import models

class CategoryController {
  // Get All Category
  async getAll(req, res) {
    try {
      // Find All Category Data
      let data = await category.find();

      // If no data found
      if (data.length === 0) {
        return res.status(404).json({
          message: "No Category Data",
        });
      }
      // If Success
      return res.status(200).json({
        message: "All Category Data Found",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }
  // Get One Category Data
  async getOne(req, res) {
    try {
      let data = await category.findOne({ _id: req.params.id });

      // If no data found
      if (data.length === 0) {
        return res.status(404).json({
          message: "No Category Data",
        });
      }
      // If Success
      return res.status(200).json({
        message: "Category Data Found",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  // Create a new Category
  async create(req, res) {
    try {
      let data = await category.create(req.body);

      // If success
      return res.status(201).json({
        message: "Success Created Category Data",
        data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
  // Update Category
  async update(req, res) {
    try {
      // Update Category Data
      let data = await category.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body, // This is all of req.body
        {
          new: true,
          // new is to return the updated category data
          // If there is no new, it will return the old data before updated
        }
      );

      // If success
      return res.status(201).json({
        message: "Success Updated Category Data",
        data,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }

  // Delete Category
  async delete(req, res) {
    try {
      // Delete Category Data
      await category.delete({ _id: req.params.id });

      return res.status(200).json({
        message: "Category Data Has Been Deleted",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: e,
      });
    }
  }
}

module.exports = new CategoryController();
