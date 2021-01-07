const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const trendSchema = new Schema({ 
  name: { type: String, index: { unique: true } }, 
  trending: Array,
  date: Date
})

const TrendModel = mongoose.model('Trend', trendSchema)

module.exports = TrendModel