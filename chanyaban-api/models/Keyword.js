/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keywordSchema = new Schema({
  name: { type: String, index: { unique: true } },
  details: String,
  isTag: Boolean,
  status: "unclassified" | "trend" | "permanent" | "common" | "banned",
  useDate: Date,
  createdDate: Date,
  modifiedDate: Date,
})

const KeywordModel = mongoose.model('Keyword', keywordSchema)

module.exports = KeywordModel