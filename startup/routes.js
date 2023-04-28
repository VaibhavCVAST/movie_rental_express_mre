const customers = require("../routes/customerRoute");
const users = require("../routes/userRoute");
const login  = require("../routes/loginRoute.js");
const genre  = require("../routes/genreRoute");

function allRoutes(app) {
  app.use("/customer", customers);
  app.use("/user", users);
  app.use("/login", login);
  app.use('/genre',genre)
}

module.exports = allRoutes
