const mongoose = require('mongoose')

const User = require('../models/User')

require('dotenv').config({ path: './config/development.env' })

mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const users = require('./data_user')

const seedData = async () => {
  try {
    await User.deleteMany()
    // await User.create(users)
    console.log('Data seeded'.cyan.underline)
  } catch (err) {
    console.error(err)
  }
}

seedData()
