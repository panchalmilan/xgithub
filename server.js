// importing npm packages
const colors = require('colors')
const express = require('express')
const morgan = require('morgan')

// importing middlewares
const errorHandler = require('./middlewares/error')

// importing routers
const repository = require('./routes/repository')
const user = require('./routes/user')
const auth = require('./routes/auth')

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

// Making uploads folder publically available
app.use(express.static('uploads'))

// using routers
app.use('/xgithub', auth)
app.use('/xgithub', repository)
app.use('/xgithub', user)

// error handling middleware
app.use(errorHandler)

// server port
const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`\n Server running on port ${PORT} `.bgGreen.black)
)
