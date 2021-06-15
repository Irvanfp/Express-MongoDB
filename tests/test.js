const request = require("supertest"); // Import supertest
const app = require("../index"); // Import app
const { user, review, movie } = require("../models");
let authenticationToken;

// Delete all data in movie review
beforeAll(async () => {
  await Promise.all([
    review.deleteMany(),
    user.deleteMany(),
    movie.deleteMany(),
  ]);
});

// Test the create review
describe("Create Review Test", () => {
  describe("/review POST", () => {
    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/signup").send({
        fullname: "irvan",
        username: "irvan",
        email: "irvan@gmail.com",
        password: "1234Irvan!",
        confirmpassword: "1234Irvan!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken = res.body.token;
    });

    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/signup").send({
        fullname: "langit",
        username: "langit",
        email: "langit@gmail.com",
        role: "admin",
        password: "1234Langit!",
        confirmpassword: "1234Langit!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken2 = res.body.token;
    });

    it("It should create a review and return the result", async () => {
      const movtest = await movie.create({
        title: "irvan",
        synopsis: "irvan",
        trailer: "https://youtube.com/watch?v=TcMBFSGVi1c",
        poster: `null`,
        cast: "607a48b3b9245305cffc2764",
        category: "607a4865b9245305cffc2762",
      });
      const res = await request(app)
        .post(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 5,
          tittle: "test",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });

    it("It should error when create a user that has already reviewed", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .post(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("user already reviewed ");
    });

    it("It should error when create a review with unauthenticated user", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .post(`/review/?movieId=${movtest._id}`)
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("No auth token");
    });

    it("It should error when create a review with wrong movie id", async () => {
      const res = await request(app)
        .post("/review/?movieId=60799e4e6070cb31c9e19b8cxxx")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    });

    it("It should error when create a review with wrong rating", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .post(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 15,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("rating should be number 1 to 10");
    });

    it("It should error when create a review with non-existant movie id", async () => {
      const res = await request(app)
        .post("/review/?movieId=60799e4e6070cb31c9e19b8c")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("movie not found");
    });
  });
});

/**
 * ==============================Show Review Test=================================================================================================================================================
 **/

describe("Show Review Test", () => {
  describe("/review/ GET", () => {
    it("It should show movie review and return the result", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .get(`/review/?movieId=${movtest._id}&page=1`)
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });

    it("It should show error when movie has no reivew yet", async () => {
      const movexist = await movie.create({
        title: "testExistence",
        synopsis: "testExistence",
        trailer: "https://youtube.com/watch?v=TcMBFSGVi1c",
        poster: `null`,
        cast: "607a48b3b9245305cffc2764",
        category: "607a4865b9245305cffc2762",
      });
      const res = await request(app)
        .get(`/review/?movieId=${movexist._id}&page=1`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("no review yet");
    });

    it("It should error when showing a review with no movieId", async () => {
      const res = await request(app).get("/review/").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    });

    it("It should error when showing a review without the proper format", async () => {
      const res = await request(app)
        .get("/review/?movieId=60799e4e6070cb31c9e19b8c&page=xxx")
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("please specify the page");
    });

    it("It should error when showing a review of non-existant movie", async () => {
      const res = await request(app)
        .get("/review/?movieId=60799e4e6070cb31c9e19b8c&page=1")
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("movie doesn't exist, no review yet");
    });
  });
});
/**
 * =======================Share Review Test========================================================================================================================================================
 */

describe("Share Review Test", () => {
  describe("/review/ GET", () => {
    it("It should create and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/signup").send({
        fullname: "pradita",
        username: "pradita",
        email: "pradita@gmail.com",
        password: "1234Pradita!",
        confirmpassword: "1234Pradita!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");
    });

    it("It should show user's review and return the result", async () => {
      const find = await user.findOne({ username: "irvan" });
      const res = await request(app)
        .get(`/review/user?userId=${find._id}&page=1`)
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });

    it("It should show error when user has no review", async () => {
      const findprad = await user.findOne({ username: "pradita" });
      const res = await request(app)
        .get(`/review/user?userId=${findprad._id}&page=1`)
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("user has no review");
    });

    it("It should error when showing a review with no userId", async () => {
      const res = await request(app).get("/review/user?userId").send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "id_user is not valid and must be 24 character & hexadecimal"
      );
    });

    it("It should error when showing a review without the proper format", async () => {
      const find = await user.findOne({ username: "irvan" });
      const res = await request(app)
        .get(`/review/user?userId=${find._id}&page=xxx`)
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("please specify the page");
    });
  });
});

/**
 * ===================Update Review Test============================================================================================================================================================
 */

describe("Update Review Test", () => {
  describe("/review PUT", () => {
    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "pradita@gmail.com",
        password: "1234Pradita!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken0 = res.body.token;
    });

    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/login").send({
        email: "irvan@gmail.com",
        password: "1234Irvan!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken = res.body.token;
    });

    it("It should update a review and return the result", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .put(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 5,
          tittle: "test",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });

    it("It should update a review and return the result even without any changes", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .put(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({});

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });

    it("It should error when user has not reviewed yet", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .put(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken0}`,
        })
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("user has not reviewed ");
    });

    it("It should error when create a review with unauthenticated user", async () => {
      const res = await request(app)
        .put("/review/?movieId=60799e4e6070cb31c9e19b8c")
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("No auth token");
    });

    it("It should error when create a review with wrong movie id", async () => {
      const res = await request(app)
        .put("/review/?movieId=60799e4e6070cb31c9e19b8cxxx")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 7,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    });

    it("It should error when create a review with wrong rating", async () => {
      const res = await request(app)
        .put("/review/?movieId=60816cd470c0ed372315d627")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 15,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("rating should be number 1 to 10");
    });

    it("It should error when updating a review of non existing movie", async () => {
      const res = await request(app)
        .put(`/review/?movieId=60816cd470c0ed372315d627`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          content: "test",
          rating: 10,
          tittle: "test",
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "movie not found, user has not reviewed "
      );
    });
  });
});

/**
 * ===================Delete Review Test============================================================================================================================================================
 */

describe("Delete Review Test", () => {
  describe("/review DELETE", () => {
    it("It should make user login and get authentication_key (jwt)", async () => {
      const res = await request(app).post("/signup").send({
        fullname: "fauzi",
        username: "fauzi",
        email: "fauzi@gmail.com",
        password: "1234Fauzi!",
        confirmpassword: "1234Fauzi!",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("token");

      authenticationToken1 = res.body.token;
    });

    it("It should create a review and return the result", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .post(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken1}`,
        })
        .send({
          content: "test",
          rating: 5,
          tittle: "test",
        });
    });

    it("It should delete a review and return the result", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .delete(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken1}`,
        })
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
      expect(res.body).toHaveProperty("data");
    });

    it("It should show error when delete a review of user who never reviewed", async () => {
      const movtest = await movie.findOne({ title: "irvan" });
      const res = await request(app)
        .delete(`/review/?movieId=${movtest._id}`)
        .set({
          Authorization: `Bearer ${authenticationToken0}`,
        })
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("user has not reviewed ");
    });

    it("It should error when deleting a review of non-existant movie", async () => {
      const res = await request(app)
        .delete("/review/?movieId=60799e4e6070cb31c9e19b8c")
        .set({
          Authorization: `Bearer ${authenticationToken1}`,
        })
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "movie not found, user has not reviewed "
      );
    });

    it("It should error when deleting a review of of non-valid movie", async () => {
      const res = await request(app)
        .delete("/review/?movieId=60799e4e6070cb31c9e19b8cxxx")
        .set({
          Authorization: `Bearer ${authenticationToken1}`,
        })
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual(
        "id_movie is not valid and must be 24 character & hexadecimal"
      );
    });
  });
});
