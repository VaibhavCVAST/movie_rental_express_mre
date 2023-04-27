const mongoose = require('mongoose')
const config = require('config')
// const database = config.get(database)

mongoose.connect(config.get("database")).then(()=>{
    console.log(`connection successful on ${config.get("database")}`)
}).catch((err)=>console.log(err))

module.exports = mongoose