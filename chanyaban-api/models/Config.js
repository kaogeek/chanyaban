/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const configSchema = new Schema({
  name: { type: String, index: { unique: true } },
  type: String,
  value: String | Number | Boolean,
  createdDate: Date,
  modifiedDate: Date,
})

const ConfigModel = mongoose.model('Config', configSchema)

module.exports = ConfigModel