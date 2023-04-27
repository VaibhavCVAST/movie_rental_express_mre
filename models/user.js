const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 20,
    minLength: 3,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: "Error: Please enter a valid email",
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

userSchema.methods.getAuthToken = function(){
    return jwt.sign({_id:this._id,isAdmin: this.isAdmin},config.get('password'))
}

const User = mongoose.model("User", userSchema);

function validateUser(input) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email : Joi.string().required,
    password : Joi.string().required,
    isAdmin: Joi.boolean().required(),
  });
}

module.exports = { User, validateUser };
module.exports.getAuthToken = userSchema.methods.getAuthToken
