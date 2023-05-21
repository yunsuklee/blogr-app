const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    content: 'First Blog',
  },
  {
    content: 'Second Blog',
  },
  {
    content: 'Third Blog',
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}