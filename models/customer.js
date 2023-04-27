const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name :{
        type : String,
        minLength : 3,
        maxLength : 20,
        required : true
    },
    phone : {
        type : String,
        length : 10,
        required : true
    },
    isGold : {
        type : Boolean,
        default : false
    }
})

const Customer = mongoose.model('Customer',customerSchema)

function validateCustomer(input){
    const schema = Joi.object({
        name : Joi.string().min(3).max(20).required(),
        phone : Joi.string().length(10).required(),
        isGold : Joi.boolean().default(false)
    })
    return schema.validate(input)
}
  
module.exports.validateCustomer=validateCustomer
module.exports.Customer=Customer