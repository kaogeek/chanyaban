/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const trendSchema = new Schema({
  name: { type: String, index: { unique: true } },
  trending: Array,
  date: Date
})

const TrendModel = mongoose.model('Trend', trendSchema)

module.exports = TrendModel