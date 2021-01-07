const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const JournalistSchema = new Schema({
  source: {type: ObjectId, ref: 'Source'},  
  image: String,
  name: String, 
  details: String, 
  createdDate: Date,
  modifiedDate: Date,
})

const JournalistModel = mongoose.model('Journalist', JournalistSchema)

module.exports = JournalistModel