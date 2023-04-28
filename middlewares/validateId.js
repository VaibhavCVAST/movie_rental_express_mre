const mongoose = require('mongoose')
function validateId(req,res,next){
    const isValid = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!isValid) return res.status(401).send("Given Id is Invalid !")
    return next()
}

module.exports.validateId = validateId