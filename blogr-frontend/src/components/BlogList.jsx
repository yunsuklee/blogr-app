import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import Blog from './Blog'
import BlogForm from './BlogForm'
import Toggable from './Toggable'

import blogService from '../services/blogs'

const BlogList = ({
  user,
  setUser,
  setNotification
}) => {
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const createBlog = async (blogObject) => {
    try {
      await blogService.create(blogObject)
      const blogs = await blogService.getAll()
      
      setBlogs(blogs)
      setNotification('success', `A new blog ${blogObject.title} by ${blogObject.author}`)
      blogFormRef.current.toggleVisibility()
    } catch(exception) {

      setNotification('error', 'Something went wrong, please try again later')
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.username} logged in
        <button onClick={() => {
          window.localStorage.removeItem('loggedBlogrAppUser')
          setUser(null)
        }}>
          logout
        </button>
      </p>
      <Toggable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Toggable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            setBlogs={setBlogs}
            setNotification={setNotification}
          />
        )}
    </div>
  )
}

BlogList.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
}

export default BlogList