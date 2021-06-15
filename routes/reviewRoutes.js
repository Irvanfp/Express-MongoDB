const express = require("express");

const reviewController = require("../controllers/reviewController");
const reviewValidator = require("../middlewares/validators/reviewValidator");

const auth = require("../middlewares/auth");

const router = express.Router();

router.route("/user").get(reviewValidator.share, reviewController.share);

router
  .route("/")
  .get(reviewValidator.show, reviewController.show)
  .post(auth.user, reviewValidator.create, reviewController.create)
  .put(auth.user, reviewValidator.update, reviewController.update)
  .delete(auth.user, reviewValidator.delete, reviewController.delete);

module.exports = router;
