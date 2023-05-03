const supertest = require("supertest");
const app = require("../../../index");
const req = supertest(app);
const { Genre } = require("../../../models/genre");
const { Movie } = require("../../../models/movie");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");

describe("/movie", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });
  //!--------------------------------
  describe("get/", () => {
    it("should return all Movies", async () => {
      const genre = new Genre({
        name: "movieGenre",
      });
      await genre.save();
      await Movie.insertMany([
        {
          title: "movie1",
          dailyRentalRate: 1,
          numberInStock: 1,
          genre: { name: genre.name, _id: genre._id },
        },
        {
          title: "movie2",
          dailyRentalRate: 1,
          numberInStock: 1,
          genre: { name: genre.name, _id: genre._id },
        },
      ]);
      const res = await req.get("/movie");
      expect(res.status).toBe(200);
      expect(res.body.some((m) => m.title == "movie1")).toBeTruthy();
      expect(res.body.some((m) => m.title == "movie2")).toBeTruthy();
    });
  });
  //!-------------------------------------
  describe("get/:id", () => {
    it("should return 404 if invalid id is passed", async () => {
        const id = new mongoose.Types.ObjectId()
      const res = await req.get("/movie" + id.toString());
      expect(res.status).toBe(404);
    });
//     //-----------------------
    it("should return movie if valid id is passed", async () => {
      const genre = new Genre({
        name: "movgenre2",
      });
      await genre.save();
      const movie = new Movie({
        title: "movieid",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
      });
      await movie.save();
      const res = await req.get(`/movie/`,movie._id);
      console.log("movie id is",movie._id.toString());
        expect(res.status).toBe(200);
        // expect(res.body).toHaveProperty("_id");
    //   expect(movie).toHaveProperty("title", "movieid");
    });
//     //------------------------
    it("should return 404 if movie is not found", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await req.get("/movie" + id);
      expect(res.status).toBe(404);
    });
  });
  //!--------------------------
  describe("post/", () => {
    it("should return 401 if the user is not logged in", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/movie")
        .set("x-auth-token", token)
        .send({ title: "movie3" });
      expect(res.status).toBe(401);
    });
//     //------------------------------
    it("should return 400 if title is less than 3 characters", async () => {
    //   const token = new User().getAuthToken();
      const res = await req
        .post("/movie")
        // .set("x-auth-token", token)
        .send({ title: "t", dailyRentalRate: 1, numberInStock: 1 });
      expect(res.status).toBe(400);
    });
//     //-------------------------
    it("should return 400 if title is more than 50 characters", async () => {
    //   const token = new User().getAuthToken();
      const title = new Array(52).join("b");
      const res = await req
        .post("/movie")
        // .set("x-auth-token", token)
        .send({ title: title, dailyRentalRate: 1, numberInStock: 1 });
      expect(res.status).toBe(400);
    });
//     //-------------------------
    it("should save the movie if it is valid", async () => {
    //   const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genrep",
      });
      await genre.save();
      await req.post("/api/movies")
    //   .set("x-auth-token", token)
      .send({
        title: "movie4",
        dailyRentalRate: 1,
        numberInStock: 1,
        genreId: genre._id,
      });
      const movies = await Movie.find({ title: "movie4" });
      expect(movies[0]).not.toBeNull();
    });
//     //---
    // it("should return save the movie if valid", async () => {
    //     const token = new User().getAuthToken();
    //     await req
    //       .post("/movie")
    //       .set("x-auth-token", token)
    //       .send({
    //         title: "validmovie",
    //         dailyRentalRate: 100,
    //         numberInStock: 50,
    //         genreId: new mongoose.Types.ObjectId("6448ea96882223f8b5dd50ed"),
    //       });
    //     const movie = await Movie.findOne({
    //       title: "validmovie",
    //     });
    //     expect(movie).toHaveProperty("title", "validmovie");
    //   });
  });
  //!------------------------------------------

  //----end
});
