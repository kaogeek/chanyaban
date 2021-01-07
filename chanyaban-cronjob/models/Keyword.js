const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keywordSchema = new Schema({
  name: { type: String, index: { unique: true } }, 
  details: String,
  isTag: Boolean,   
  status: "unclassified"| "trend" | "permanent" | "common" | "banned",
  useDate: Date,
  createdDate: Date,
  modifiedDate: Date,
})

const KeywordModel = mongoose.model('Keyword', keywordSchema)

module.exports = KeywordModel