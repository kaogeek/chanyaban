const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsAgencySchema = new Schema({
  icon: String, 
  name: String, 
  createdDate: Date,
  modifiedDate: Date
})

const NewsAgencyModel = mongoose.model('NewsAgency', newsAgencySchema)

module.exports = NewsAgencyModel