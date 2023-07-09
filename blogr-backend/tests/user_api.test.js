const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({}) // Delete all remaining users in db

    const passwordHash = await bcrypt.hash('test', 10)
    const user = new User({ username: 'test', passwordHash }) // Creates user

    await user.save() // Saves it in db
  })

  test('Creation succeeds with fresh username', async () => {
    const usersAtStart = await helper.usersInDb() // Save users before insert

    const newUser = { // Creates user to insert
      username: 'test2',
      password: 'test2'
    }

    await api // Inserts user and checks for proper response
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb() // Gets users after insesrt
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1) // Checks for proper length

    const usernames = usersAtEnd.map(user => user.username) // Gets users usernames
    expect(usernames).toContain(newUser.username) // Checks for added username
  })

  test('Creation fails if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb() // Save users before insert

    const newUser = { // Creates user to insert
      username: 'test',
      password: 'test'
    }

    const result = await api // Inserts user and checks for proper response
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username already taken') // Checks error message

    const usersAtEnd = await helper.usersInDb() // Gets users after insesrt
    expect(usersAtEnd).toEqual(usersAtStart) // Checks for immutability
  })

  test('User can be removed with correct password', async () => {
    const usersAtStart = await helper.usersInDb()

    const userToDelete = usersAtStart[0]

    const response = await api // Logs in
      .post('/api/login')
      .send({ username: 'test', password: 'test' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .set('Authorization', 'Bearer ' + response.body.token)
      .send({ password: 'test' })
      .expect(204)

    const usersAfterDeletion = await helper.usersInDb()
    expect(usersAfterDeletion).toHaveLength(usersAtStart.length - 1)
  })
})

describe('Creating new users', () => {
  beforeEach(async () => await User.deleteMany({}))

  test('Fails with no username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('Fails with too short username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'tes',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be at least 4 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('Fails with no password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      password: ''
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('Fails with too short password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      password: 'tes'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 4 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})