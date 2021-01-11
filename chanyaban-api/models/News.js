/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const newsSchema = new Schema({
  keywords: [{
    keywordId: { type: ObjectId, ref: 'Keyword' },
    countTitle: Number,
    countContent: Number,
    countAll: Number
  }],
  journalists: [{ type: ObjectId, ref: 'Journalists' }],
  source: { type: ObjectId, ref: 'Source' },
  title: String,
  link: { type: String, index: { unique: true } },
  img: String,
  content: String,
  date: { type: Date, index: true },
  createdDate: Date,
  modifiedDate: Date
})

const NewsModel = mongoose.model('News', newsSchema)

module.exports = NewsModel