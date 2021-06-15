const express = require("express");
const router = express.Router();
// Import validator
const userValidator = require("../middlewares/validators/userValidator");

// Import controller
const userController = require("../controllers/userController");

// Import auth (middleware)
const auth = require("../middlewares/auth");

// Get one user
router.get("/:id", userValidator.getOne, userController.getOne);

// Update user
router.put("/:id", userValidator.update, userController.update);

module.exports = router;
