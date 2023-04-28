const express = require("express");
const router = express.Router();
const { Movie, validateMovie} = require('../models/movie')
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/admin");

router.get('/',async(req,res)=>{
    const movie = await Movie.find()
    if(!movie) return res.status(400).send(movie.error.details[0].message)
})