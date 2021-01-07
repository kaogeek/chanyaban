const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sourceTypeSchema = new Schema({ 
  icon: String,
  name: { type: String, index: { unique: true } },
  details: String,
  createdDate: Date,
  modifiedDate: Date
})

const SourceTypeModel = mongoose.model('SourceType', sourceTypeSchema)

module.exports = SourceTypeModel