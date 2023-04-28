const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/admin");
const { valid } = require("joi");
const { Genre } = require("../models/genre");
const { validateId } = require("../middlewares/validateId");

router.get("/", async (req, res) => {
  const movie = await Movie.find();
  if (!movie) return res.status(400).send(movie.error.details[0].message);
  res.status(200).send(movie);
});

router.get("/:id", auth, validateId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(200).send("invalid Id");
  res.status(200).send(movie);
});

router.post("/", async (req, res) => {
  const validate = validateMovie(req.body);
  if (!validate) return res.status(400).send(validate.error.details[0].message);

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(400).send("invalid genre id");

  const { title, dailyRentalRate, numberInStock, liked } = req.body;
  const createMovie = await new Movie({
    title,
    dailyRentalRate,
    numberInStock,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    liked,
  });
  createMovie.save();
  res.status(200).send(createMovie);
});

router.put("/:id", auth, validateId, async (req, res) => {
  const validate = validateMovie(req.body);
  if (!validate) return res.status(400).send("validation failed");

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(400).send("invalid genre id");

  const { title, dailyRentalRate, numberInStock, liked } = req.body;
  const updateMovie = await Movie.findByIdAndUpdate(req.params.id, {
    title,
    dailyRentalRate,
    numberInStock,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    liked,
  });
  res.status(200).send(updateMovie);
});

router.delete("/:id", auth, admin, validateId, async (req, res) => {
  const deleteMovie = await Movie.findByIdAndDelete(req.params.id, {});
  if (!deleteMovie)
    return res.status(400).send(deleteMovie.error.details[0].message);
  res.status(200).send(deleteMovie);
});

module.exports = router;
