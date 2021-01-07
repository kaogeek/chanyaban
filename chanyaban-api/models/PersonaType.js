const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personaTypeSchema = new Schema({ 
  icon: String,
  name: { type: String, index: { unique: true } },
  details: String,
  createdDate: Date,
  modifiedDate: Date
})

const PersonaTypeModel = mongoose.model('PersonaType', personaTypeSchema)

module.exports = PersonaTypeModel