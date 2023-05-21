const supertest = require('supertest')
const bcrypt = require('bcrypt')
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

  test('Succeeds with correct credentials', async () => {
    const user = {
      username: 'test',
      password: 'test'
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toEqual(user.username)
  })

  test('Fails with wrong username', async () => {
    const user = {
      username: 'notTest',
      password: 'test'
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid username or password')
  })

  test('Fails with wrong password', async () => {
    const user = {
      username: 'test',
      password: 'notTest'
    }

    const result = await api
      .post('/api/login')
      .send(user)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid username or password')
  })
})