const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  // Resets blogs in db
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  // Resets users in db
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('root', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('When there are some initial blogs in db', () => {
  test('Blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('Verifies existence of property id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('When adding new blogs', () => {
  test('Valid blog can be added', async () => {
    const newBlog = {
      content: 'Test blog',
    }

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsInDb()
    expect(blogsAfterAdding).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAfterAdding.map(blog => blog.content)
    expect(contents).toContain('Test blog')
  })

  test('Valid blog can be added', async () => {
    const newBlog = {
      content: 'Test blog',
    }

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsInDb()
    expect(blogsAfterAdding).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAfterAdding.map(blog => blog.content)
    expect(contents).toContain('Test blog')
  })

  test('If likes is missing it defaults to zero', async () => {
    const newBlog = {
      content: 'Test blog',
    }

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsInDb()
    expect(blogsAfterAdding).toHaveLength(helper.initialBlogs.length + 1)

    expect(blogsAfterAdding.at(-1).likes).toBe(0)
  })

  test('Date is set', async () => {
    const newBlog = {
      content: 'Test blog',
    }

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsInDb()
    expect(blogsAfterAdding).toHaveLength(helper.initialBlogs.length + 1)

    expect(blogsAfterAdding.at(-1).creationDate).toBeDefined()
  })

  test('No content fails', async () => {
    const emptyContent = {
      content: '',
      likes: 100,
    }

    const noContent = {
      likes: 100,
    }

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(emptyContent)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(noContent)
      .expect(400)

    const blogsAfterAdding = await helper.blogsInDb()
    expect(blogsAfterAdding).toHaveLength(helper.initialBlogs.length)
  })

  test('If no token is provided fails', async () => {
    const newBlog = {
      content: 'Test blog',
    }

    await api
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAfterAdding = await helper.blogsInDb()
    expect(blogsAfterAdding).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Manipulating already existing blogs', () => {
  test('Deleting a single blog post', async () => {
    await Blog.deleteMany({}) // Empties db

    const response = await api // Logs in
      .post('/api/login')
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      content: 'Test blog',
    }

    await api // Adds a blog to delete
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + response.body.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsBeforeDeletion = await helper.blogsInDb()
    const blogToDelete = blogsBeforeDeletion[0] // Retrieves blog's id

    await api // Deletes blog
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer ' + response.body.token)
      .expect(204)

    const blogsAfterDeletion = await helper.blogsInDb()
    expect(blogsAfterDeletion).toHaveLength(blogsBeforeDeletion.length - 1)
  })

  test('Updating blog\'s information', async () => {
    const blogsBeforeUpdate = await helper.blogsInDb()
    const blogToUpdate = blogsBeforeUpdate[0]

    const updatedBlog = {
      likes: 10000
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAfterUpdate = await helper.blogsInDb()
    expect(blogsAfterUpdate[0].likes).toBe(10000)
  })
})