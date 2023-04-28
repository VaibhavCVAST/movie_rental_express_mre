const customers = require("../routes/customerRoute");
const users = require("../routes/userRoute");
const login  = require("../routes/loginRoute.js");
const genre  = require("../routes/genreRoute");
const movie = require('../routes/movieRoute')
const rental = require('../routes/rentalRoute')

function allRoutes(app) {
  app.use("/customer", customers);
  app.use("/user", users);
  app.use("/login", login);
  app.use('/genre',genre)
  app.use('/movie',movie)
  app.use('/rental',rental)
}

module.exports = allRoutes
