const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const personaSchema = new Schema({ 
  image: String,
  name: { type: String, index: { unique: true } },
  details: String,
  personaType: {type: ObjectId, ref: 'PersonaType'},
  keywords: [{type: ObjectId, ref: 'Keyword'}],
  createdDate: Date,
  modifiedDate: Date,
})

const PersonaModel = mongoose.model('Persona', personaSchema)

module.exports = PersonaModel