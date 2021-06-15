const express = require("express");
const passport = require("passport");

// Import validator
const authValidator = require("../middlewares/validators/authValidator");
// Import controller
const authController = require("../controllers/authController");

// Import auth (middleware)
const auth = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/signup",
  authValidator.signup,
  auth.signup,
  authController.getToken
);

// If user access /auth/signin (POST)
router.post("/login", authValidator.login, auth.login, authController.getToken);

module.exports = router;
