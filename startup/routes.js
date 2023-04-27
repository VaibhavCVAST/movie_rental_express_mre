const customers = require("../routes/customerRoute");
const users = require("../routes/userRoute");
const login  = require("../routes/loginRoute.js");

function allRoutes(app) {
  app.use("/customer", customers);
  app.use("/user", users);
  app.use("/login", login);
}

module.exports = allRoutes
