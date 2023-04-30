require('./startup/db')
require('express-async-error')
const express = require('express')
const app = express()
const startServer = require('./startup/port')
const Process = require('./startup/logging');
const allRoutes = require("./startup/routes");
app.use(express.json());
app.use(Process)
startServer(app)
allRoutes(app)

module.exports = app