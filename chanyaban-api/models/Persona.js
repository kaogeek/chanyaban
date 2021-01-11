/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const personaSchema = new Schema({
  image: String,
  name: { type: String, index: { unique: true } },
  details: String,
  personaType: { type: ObjectId, ref: 'PersonaType' },
  keywords: [{ type: ObjectId, ref: 'Keyword' }],
  createdDate: Date,
  modifiedDate: Date,
})

const PersonaModel = mongoose.model('Persona', personaSchema)

module.exports = PersonaModel