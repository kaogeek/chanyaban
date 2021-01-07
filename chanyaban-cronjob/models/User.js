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