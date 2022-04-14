const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  loggedIn: String,
  user: Object,
  userStatus: Object,
  emoji: String,
  friends: Number,
  followers: Array,
  projects: Array,
  styles: Object
})

const Users = mongoose.model('users', userSchema)

module.exports = Users
