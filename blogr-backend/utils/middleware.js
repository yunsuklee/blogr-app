const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Function to log information about incoming HTTP requests
const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next() // Passes control to next middleware in chain
}

// Function to handle unkown URL paths
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Function to handle errors thrown by other middleware
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    // Bad ID in MongoDB query
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // Object fails Mongoose validation
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    // JWT invalid or missing
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  next(error) // Passes error
}

// Function to extract token from Authorization header in HTTP request
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    // Sets token property, removing Bearer prefix
    request.token = authorization.replace(/Bearer /, '')
  }

  next()
}

// Function to verify User
const userExtractor = async (request, response, next) => {
  // Verifies token
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // In case token is invalid or does not contain a valid user ID
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}