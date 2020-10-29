const colors = require('colors')
const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

// database connection
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_PATH, options)
  console.log(`\n MongoDB connected: ${conn.connection.host}`.bgYellow.black)
  console.log(`${process.env.DB_PATH}`.yellow.underline)
  return conn
}

module.exports = connectDB
