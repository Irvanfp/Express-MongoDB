const express = require("express");
const router = express.Router();

const movieValidator = require("../middlewares/validators/movieValidator");
const auth = require("../middlewares/auth");

const movieController = require("../controllers/movieController");

router.get("/", movieController.getAll);
router.get("/:id", movieValidator.getOne, movieController.getOne);
router.get("/category/:category", movieController.showMovieBy);

router.post("/", auth.admin, movieValidator.create, movieController.create);
router.put("/:id", auth.admin, movieValidator.update, movieController.update);
router.delete(
  "/:id",
  auth.admin,
  movieValidator.delete,
  movieController.delete
);

module.exports = router;
