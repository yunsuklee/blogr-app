const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Retrieves all users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { content: 1, id: 1 })

  response.json(users)
})

// Creates new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Username validation
  if (!username) { // If username was not submitted
    return response.status(400).json({
      error: 'username is required'
    })
  } else if (username.length < 4) {
    return response.status(400).json({ // Username requirements
      error: 'username must be at least 4 characters long'
    })
  } else {
    const existingUser = await User.findOne({ username })
    if (existingUser) { // Makes sure user does not already exist
      return response.status(400).json({
        error: 'username already taken'
      })
    }
  }

  // Password validation
  if (!password) { // If password was not submitted
    return response.status(400).json({
      error: 'password is required'
    })
  } else if (password.length < 4) { // Password requirements
    return response.status(400).json({
      error: 'password must be at least 4 characters long'
    })
  }

  // Password hashing
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Makes sure password is never directly exposed
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter