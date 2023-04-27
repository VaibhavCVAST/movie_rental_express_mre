const express = require("express");
const router = express.Router();
const { User, getAuthToken, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  res.status(200).send("verified user");
});

router.post("/", async (req, res) => {
  const validation = validateUser(req.body);
  if (validation) return res.status(400).send(validation.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email");

  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid password !");

  const token = getAuthToken();
  console.log(token);
  res.send(token);
});

module.exports = router;
