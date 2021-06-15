const { review, movie } = require("../models");

class ReviewController {
  /**Show Review  ==============================================================================================================
   */
  async show(req, res) {
    try {
      let options = {
        page: req.body.page,
        limit: 10,
        sort: "-updatedAt",
        leanWithId: true,
        collation: { locale: "en" },
      };

      let data = await review.paginate({ movie: req.body.movie }, options);
      let lastPage = Math.floor(data.length / 10) + 1;
      if (options.page > lastPage || options.page < 0) options.page = 1;

      if (data.length === 0) {
        return res.status(404).json({
          message: "review Not Found",
        });
      }

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.error("controller", e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  /**Share Review  ==============================================================================================================
   */
  async share(req, res) {
    try {
      let options = {
        page: req.query.page,
        limit: 10,
        sort: "-updatedAt",
        collation: { locale: "en" },
      };

      let data = await review.paginate({ user: req.body.user }, options);
      let lastPage = Math.floor(data.length / 10) + 1;
      if (options.page > lastPage || options.page < 0) options.page = 1;

      if (data.length === 0) {
        return res.status(404).json({
          message: "review Not Found",
        });
      }

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.error("controller", e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  /**Create Review for Movie =============================================================================================
   */
  async create(req, res) {
    try {
      let data = await review.create(req.body);
      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.error("controller", e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  /**Update Review for Movie =============================================================================================
   */
  async update(req, res) {
    try {
      let data = await review.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runvalidator: true,
      });
      await data.save(); //last added, if wrong try to delete 'await'

      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.error("controller", e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  /**Delete Review for Movie =============================================================================================
   */
  async delete(req, res) {
    try {
      let data = await review.findOne({ _id: req.body.review });
      await data.remove();

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      console.error("controller", e);
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }
}

module.exports = new ReviewController();
