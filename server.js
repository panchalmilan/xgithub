// importing npm packages
const colors = require('colors')
const express = require('express')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')

// Loading env variables
require('dotenv').config({ path: './config/config.env' })

// importing middlewares
const errorHandler = require('./middlewares/error')

// importing routers
const repository = require('./routes/repository')
const user = require('./routes/user')
const auth = require('./routes/auth')

// Database Connection
const connectDB = require('./config/db')
connectDB()

const app = express()

// production mode
colors.disable()

// development mode
if (process.env.NODE_ENV === 'development') {
  colors.enable()
  console.log('\nDevelopment Mode'.underline.yellow.bold)
  // Logging requests
  app.use(morgan('dev'))
}

// body parser
app.use(express.json())

// Documention
app.use(
  '/xgithub/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(require('./config/docs').swaggerDocs)
)

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

app.listen(PORT, console.log(`Server running on port ${PORT} `.bgGreen.black))
