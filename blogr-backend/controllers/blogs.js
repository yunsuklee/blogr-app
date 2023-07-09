const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

// Retrieves all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

// Retrieves a single blog by ID
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Creates new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user // userExtractor attaches the user information

  const newBlog = new Blog({
    ...body,
    likes: [],
    user: user._id
  })

  // Blog validation
  if (!newBlog.content) {
    return response.status(400).json({
      error: 'content is required'
    })
  } else if (!newBlog.content.length) {
    return response.status(400).json({
      error: 'content needs minimum characters'
    })
  }

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Deletes a blog by ID
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user // userExtractor attaches the user information

  // Checks if the User trying to delete the Blog is the author
  if (blog.user.toString() === user.id) {
    await Blog.findByIdAndRemove(blog.id)
  } else{
    return response.status(401).json({ error: 'invalid token' })
  }

  response.status(204).end()
})

// Updates a Blog's likes
blogsRouter.put('/:id', async (request, response) => {
  const { id: blogId } = request.params
  const { userId } = request.body

  try {
    const blog = await Blog.findById(blogId)

    // Check if blog exists
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    // Check if user has already liked blog
    if (blog.likes.includes(userId)) {
      return response.status(400).json({ error: 'User has already liked the blog' })
    }

    // Add the User's Id to the likes array
    blog.likes.push(userId)
    await blog.save()
    return response.status(200).json(blog)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = blogsRouter