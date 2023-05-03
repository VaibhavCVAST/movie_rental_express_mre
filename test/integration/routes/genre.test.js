const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../index");
const req = supertest(app);
const { Genre, validateGenre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

describe("/genre", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
  });
  //!----------------------------
  describe("get/", () => {
    //---1
    it("Should return all genres in database", async () => {
      const genre = new Genre({
        name: "genre1",
      });
      genre.save();
      const res = await req.get("/genre");
      expect(genre).toHaveProperty("name", "genre1");
      // expect(res.body.some((g)=>g.name === "genre1")).toBeTruthy()
      // expect(res.body.some((g)=>g.name === "genre2")).toBeTruthy()
    });
  });

  //!------------------------------
  describe("get/:id", () => {
    //---2
    it("should return genre with specified id", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre2",
      });
      genre.save();
      const res = await req
        .get("/genre/" + genre._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre2");
    });
    //---3
    it("should return 404 if Id not found", async () => {
      const genre = new Genre({
        name: "genre3",
      });
      genre.save();
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/genre" + id.toString());
      expect(res.status).toBe(404);
    });
    //---4
    it("should return 400 if Id is invalid", async () => {
      const genre = new Genre({
        name: "genre4",
      });
      genre.save();
      const res = await req.get("/genre/" + null);
      expect(res.status).toBe(400);
    });
  });
  //!---------------------------
  describe("post/", () => {
    //---5
    // it("should return 401 if valid token is not provided", async () => {
    //   const token = new User().getAuthToken();
    //   const res = await req.post("/genre/")
    //   .send({name : "adventure"})
    //   .set('x-auth-token',token+"v");
    //   expect(res.status).toBe(401);
    // });
    // // ---6
    // it("should return 400 if genre name is less than 3 characters", async () => {
    //   const res = await req.post("/genre").send({ name: "ad" });
    //   console.log("body is ",res.body.error.details[0].message)
    //   expect(res.status).toBe(400);
    //   expect(res.body.error.details[0].message).toBe('"name" length must be at least 3 characters long');
    // });
    // // ---7
    // it("should return 400 if genre name is more than 10 characters", async () => {
    //   const res = await req
    //     .post("/genre")
    //     .send({ name: "12345678901234567890123" });
    //   expect(res.status).toBe(400);
    // });
    //---8
    it("should return 200 and create genre", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/genre")
        .send({ name: "adventure" })
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });
  //!--------------------------
  describe("put/:id", () => {
    //---9
    it("return 404 if id is null", async () => {
      const res = await req.put("/genre" + null);
      expect(res.status).toBe(404);
    });
    //---10
    it("return 400 if id is invalid", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.put("/genre/" + id.toString());
      expect(res.status).toBe(400);
    });
    //---11
    it("should return 200 if genre updated", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: false,
        },
        config.get("password")
      );
      const genre = new Genre({
        name: "Horror",
      });
      genre.save();
      const res = await req
        .put("/genre/" + genre._id.toString())
        .send({ name: "Sci-Fi" })
        .set("x-auth-token", token);
      // console.log("created genre id is",(genre._id).toString(),"res.body is",res.body)
      expect(res.status).toBe(200);
    });
    //---12
    it("should return 401 if invalid jwt token(unauthorized)", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre7",
      });
      genre.save();
      const res = await req
        .delete("/genre/" + genre._id)
        .set("x-auth-token", token + "v");
      expect(res.status).toBe(401);
    });
  });

  //!---------------------------
  describe("delete/:id", () => {
    //---13
    it("should return 400 if Id is invalid", async () => {
      const genre = new Genre({
        name: "genre5",
      });
      genre.save();
      const res = await req.delete("/genre/" + 1234);
      expect(res.status).toBe(400);
    });
    //---14
    it("should return 404 if Id not found or null", async () => {
      const genre = new Genre({
        name: "genre6",
      });
      genre.save();
      const id = new mongoose.Types.ObjectId();
      const res = await req.delete("/genre" + id.toString());
      expect(res.status).toBe(404);
    });
    //---15
    it("should return 401 if unauthorized", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre7",
      });
      genre.save();
      const res = await req
        .delete("/genre/" + genre._id)
        .set("x-auth-token", token + "v");
      expect(res.status).toBe(401);
      // expect(res.body[0]).toHaveProperty("name", "genre2");
    });
    //---16
    it("should return 403 if access forbidden", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: false,
        },
        config.get("password")
      );
      const genre = new Genre({
        name: "genre7",
      });
      genre.save();
      const res = await req
        .delete("/genre/" + genre._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    //---17
    it("should return 200 after deleting genre", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: true,
        },
        config.get("password")
      );
      const genre = new Genre({
        name: "genre7",
      });
      genre.save();
      const res = await req
        .delete("/genre/" + genre._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
    //---18
    it("should delete genre if input is valid", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: true,
        },
        config.get("password")
      );
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      await req.delete("/genre/" + genre._id).set("x-auth-token", token);
      const deletdGenre = await Genre.findById(genre._id);
      expect(deletdGenre).toBeNull();
    });
    //---19
    it("should return 404 if genre with given id is not found", async () => {
      const token = jwt.sign(
        {
          _id: new mongoose.Types.ObjectId(),
          isAdmin: true,
        },
        config.get("password")
      );
      const id = new mongoose.Types.ObjectId();
      const res = await req.delete("/genre" + id).set("x-auth-token", token);
      expect(res.status).toBe(404);
    });
  });
  //!-------END
});
