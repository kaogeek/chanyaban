/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

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