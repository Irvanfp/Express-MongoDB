// Import Express
const express = require("express");

// Make a router
const router = express.Router();

// Cast Validator
const CastValidator = require("../middlewares/validators/castValidator");

// Cast Controller
const CastController = require("../controllers/castController");

// Create
router.post("/", CastValidator.create, CastController.create);

// Get All
router.get("/", CastController.getAll);

// Get One
router.get("/:id", CastValidator.getOne, CastController.getOne);

// Update
router.put("/:id", CastController.update);

// Delete
router.delete("/:id", CastController.delete);

module.exports = router;
