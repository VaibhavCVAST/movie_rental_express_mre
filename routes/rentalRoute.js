const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/admin");
const { validateId } = require("../middlewares/validateId");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.status(200).send(rentals);
});

router.get("/:id", auth, validateId, async (req, res) => {
  const rentals = await Rental.findById(req.params.id);
  console.log("this is rentals");
  if (!rentals)
    return res.status(404).send("Rental with given id is not found.");
  res.status(200).send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  const movie = await Movie.findById(req.body.movieId);

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie Out Of Stock !");

  // const { title, numberInStock, dailyRentalRate } = movie;
  // const { name, phone } = customer;
  const rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    rentalFee: movie.dailyRentalRate * 10,
  });

  const session = await Rental.startSession();
  session.startTransaction();
  try {
    await rental.save();
    movie.numberInStock = movie.numberInStock - 1;
    await movie.save();
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
  session.commitTransaction();
  session.endSession();
  await rental.save();
  res.send(rental);
});

router.patch("/:id", auth, validateId, async (req, res) => {
  // const { title, numberInStock, dailyRentalRate } = movie;

  const session = await Rental.startSession();
  session.startTransaction();
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      { dateIn: new Date(req.body.dateIn) },
      { new: true }
    );

    const movie = await Movie.findByIdAndUpdate(rental.movie._id);
    movie.numberInStock = movie.numberInStock + 1;
    await movie.save();
    res.send(rental);
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
  session.commitTransaction();
  session.endSession();
});

router.delete("/:id", auth, admin, validateId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(400).send(rental.error.details[0].message);
  const deleteRental = await Rental.findByIdAndDelete(rental._id, {});
  res.status(200).send(deleteRental);
});

module.exports = router;
