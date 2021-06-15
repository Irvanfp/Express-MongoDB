// Import Express
const express = require("express");

// Make a router
const router = express.Router();

// Cast Validator
const CategoryValidator = require("../middlewares/validators/categoryValidator");

// Cast Controller
const CategoryController = require("../controllers/categoryController");

// Create
router.post("/", CategoryValidator.create, CategoryController.create);

// Get All
router.get("/", CategoryController.getAll);

// Get One
router.get("/:id", CategoryValidator.getOne, CategoryController.getOne);

// Update
router.put("/:id", CategoryValidator.update, CategoryController.update);

// Delete
router.delete("/:id", CategoryValidator.delete, CategoryController.delete);

module.exports = router;
