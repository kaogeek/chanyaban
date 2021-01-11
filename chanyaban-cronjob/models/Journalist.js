/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const JournalistSchema = new Schema({
  source: { type: ObjectId, ref: 'Source' },
  image: String,
  name: String,
  details: String,
  createdDate: Date,
  modifiedDate: Date,
})

const JournalistModel = mongoose.model('Journalist', JournalistSchema)

module.exports = JournalistModel