/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrySchema = new Schema({
  name: String,
  states: [String],
})

const CountryModel = mongoose.model('Country', CountrySchema)

module.exports = CountryModel