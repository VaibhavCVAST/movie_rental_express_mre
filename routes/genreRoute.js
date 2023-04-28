const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre");
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/admin");

router.get("/", async (req, res) => {
  const genre = await Genre.find();
  if (!genre) return res.status(400).send(genre.error.details[0].message);
  res.status(200).send(genre);
});

router.get("/:id", auth, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(200).send("invalid Id");
  res.status(200).send(genre);
});

router.post("/", async (req, res) => {
  const validate = validateGenre(req.body);
  if (!validate) return res.status(400).send(validate.details[0].message);
  const createGenre = await new Genre({
    name: req.body.name,
  });
  createGenre.save();
  res.status(200).send(createGenre);
});

router.put("/:id", auth, async (req, res) => {
  const validate = validateGenre(req.body);
  if (!validate) return res.status(400).send(validate.details[0].message);
  const updateGenre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });
  updateGenre.save();
  res.status(200).send(updateGenre);
});

router.delete("/:id", auth, admin, async (req, res) => {
  const deleteGenre = await Genre.findByIdAndDelete(req.params.id, {});
  if (!deleteGenre) return res.status(400).send("Invalid Id");
  res.status(200).send(deleteGenre);
});

module.exports = router;
