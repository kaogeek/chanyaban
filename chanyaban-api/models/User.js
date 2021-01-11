/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  createdDate: Date,
  modifiedDate: Date
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel