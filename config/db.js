const colors = require('colors')
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

let connectionString
if (process.env.DB_SERVICE === 'cloud') {
  require('dotenv').config({ path: './config/secrets.env' })
  connectionString = `mongodb+srv://panchalmilan:${process.env.DB_PASSWORD}@cluster0.grw2b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
} else {
  connectionString = process.env.DB_PATH
}

// database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(connectionString, options)
    console.log('')
    console.log(`MongoDB connected: ${conn.connection.host}`.yellow.underline)
    console.log(`${process.env.DB_PATH}`.yellow.underline)
    return conn
  } catch (err) {
    console.error(err)
  }
}

module.exports = connectDB
