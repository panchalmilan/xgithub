// importing npm packages
const colors = require('colors')
const express = require('express')
const morgan = require('morgan')

// importing routers
const repository = require('./routes/repository')
const user = require('./routes/user')

// Loading env variables
require('dotenv').config({ path: './config/config.env' })

// Database Connection
const connectDB = require('./config/db')
connectDB()

const app = express()

// body parser
app.use(express.json())

// Logging requests
app.use(morgan('dev'))

// using routers
app.use('/xgithub', repository)
app.use('/xgithub', user)

// server port
const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`\n Server running on port ${PORT} `.bgGreen.black)
)
