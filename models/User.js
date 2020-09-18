const colors = require('colors')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    maxlength: [20, 'username cant be more than 20 chars'],
    minlength: [6, 'username must be atleast 6 chars'],
    required: true,
    // lowerCase: true
  },
  password: {
    type: String,
    minlength: [6, 'Password must be atleast 6 chars'],
    required: true,
    // match: regex
  },
  name: {
    type: String,
    trim: true,
    maxlength: [30, 'Name cant be more than 30 chars'],
    minlength: [5, 'name must be atleast 5 chars'],
    required: true,
  },
  email: {
    type: String,
    // match: regex,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    default: 'Hello World',
    maxlength: [250, 'Bio cant be more than 250 chars'],
  },
  // Photo Upload
  starred: {
    type: Number,
    default: 0,
  },
  noOfRepositories: {
    type: Number,
    default: 0,
  },
  noOfPublicRepositories: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('User', UserSchema)

// Check email uniqueness
