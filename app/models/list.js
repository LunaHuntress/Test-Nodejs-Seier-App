const mongoose = require('mongoose')

const Schema = mongoose.Schema

const listSchema = new Schema ({
    
    name : { type: String, required: true},
    image : { type: String, required: true},
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    materialusage: { type: String, required: true},
    colors: { type: String, required: true },
    fabrics: { type: String, required: true },
    // measurements: { type: Number, required: true }
})

const List = mongoose.model('List', listSchema)

module.exports = List