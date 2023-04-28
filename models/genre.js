const mongoose = require('mongoose')
const Joi  = require('joi')

const genreSchema = new mongoose.Schema({
    name : {
        type : String,
        minLength : 3,
        maxLength : 10,
        required: true
    }
})

const Genre = mongoose.model("Genre",genreSchema)

function validateGenre(input){
    const schema = Joi.object({
        name : Joi.string().min(3).max(10).required()
    })
    return schema.validate(input)
}

module.exports = {Genre , validateGenre}