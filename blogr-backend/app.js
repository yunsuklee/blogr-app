const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
require('express-async-errors')

// Router objects to handle endpoints
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// In case app is running in test environment
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// Middleware to handle requests in the app
const middleware = require('./utils/middleware')

// Indicates DB connection try
logger.info('connecting to', config.MONGODB_URI)

// Connects to Mongo DB
mongoose.set('strictQuery', false).connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Setup of middleware
app.use(cors()) // Allows resources from other domains to be accessed by the app
app.use(express.static('build')) // Serves static files from build directory
app.use(express.json()) // Parses incoming JSON requests into req.body
app.use(middleware.requestLogger) // Logs info about incoming HTTP requests
app.use(middleware.tokenExtractor) // Extracts authentication tokens

// Mounts router objects onto specific paths
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint) // Handles unkown endpoints
app.use(middleware.errorHandler) // Handles errors

module.exports = app