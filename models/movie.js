const mongoose = require("mongoose");
const Joi = require("joi");
const { trimStart } = require("lodash");
Joi.objectId = require("joi-objectid")(Joi);

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    required: true,
  },
  genre: {
    _id: mongoose.Types.ObjectId,
    name: String,
  },
  liked: {
    type: Boolean,
    default: false,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(input) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(20).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    numberInStock: Joi.number().min(0).required(),
    genre: Joi.objectId().required(),
    liked: Joi.boolean().default(false),
  });
  return schema.validate(input)
}

module.exports = { validateMovie, Movie };
