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
  console.log(`MongoDB connected: ${conn.connection.host}`.bgCyan.black)
}

module.exports = connectDB
