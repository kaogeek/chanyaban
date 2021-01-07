const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsCategorySchema = new Schema({
  name: String, 
  details: String, 
  createdDate: Date,
  modifiedDate: Date,
})

const NewsCategoryModel = mongoose.model('NewsCategory', NewsCategorySchema)

module.exports = NewsCategoryModel