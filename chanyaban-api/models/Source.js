/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const sourceSchema = new Schema({
  image: String,
  name: String,
  link: String,
  isScraping: Boolean,
  isUsable: Boolean,
  newsAgency: { type: ObjectId, ref: 'NewsAgency' },
  newsCategory: { type: ObjectId, ref: 'NewsCategory' },
  selectorData: {
    find: String,
    setData: {
      title: String,
      img: String,
      content: String,
      tags: String,
      date: String,
      journalistName: String,
      journalistImage: String
    },
    preAddLinkImg: String,
    configDate: {
      isConvert: Boolean,
      format: String,
      locale: String
    }
  },
  selectorUpdate: {
    find: String,
    paginate: String,
    pageLimit: Number,
    setLink: String,
    preAddLink: String,
    addLink: String
  },
  country: { type: ObjectId, ref: 'Country' },
  city: String,
  setTimeout: Number,
  sourceType: { type: ObjectId, ref: 'SourceType' },
  createdDate: Date,
  modifiedDate: Date
})

const SourceModel = mongoose.model('Source', sourceSchema)

module.exports = SourceModel