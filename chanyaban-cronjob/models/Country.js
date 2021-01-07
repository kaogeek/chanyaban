const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrySchema = new Schema({
  name: String, 
  states: [String],
})

const CountryModel = mongoose.model('Country', CountrySchema)

module.exports = CountryModel