const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/admin");
// const { create } = require("lodash");
const bcrypt = require("bcrypt");
const { validateId } = require("../middlewares/validateId");

router.get("/", async (req, res) => {
  const user = await User.find();
  if (!user) return res.status(400).send("cannot get users");
  res.status(200).send(user);
});

router.get("/:id", auth, validateId, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send(error.details[0].message);
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  const error = validateUser(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.error.details[0].message);
  const { name, email, password, isAdmin } = req.body;
  const createUser = new User({
    name,
    email,
    password,
    isAdmin,
  });
  createUser.password = await bcrypt.hash(createUser.password, 10);
  await createUser.save();
  res.status(200).send(createUser);
});

router.put("/:id", auth, validateId, async (req, res) => {
  // const user = await User.findById(req.params.id);
  // if (!user) return res.status(404).send("invalid userId");
  const { name, email, password, isAdmin } = req.body;
  const updateUser = await User.findByIdAndUpdate(req.params.id, {
    name,
    email,
    password,
    isAdmin,
  });
  if (!updateUser)
    return res.status(404).send("User with given id is not found.");
  updateUser.password = await bcrypt.hash(updateUser.password, 10);
  console.log(updateUser.password);
  await updateUser.save();
  res.send(updateUser);
  // res.status(200).send(updateUser);
});

router.delete("/:id", auth, admin,validateId,  async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(400).send("invalid Id");
  res.status(200).send(user);
});

// router.put('/:id',)

module.exports = router;
