import { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const Blog = ({
  blog,
  user,
  setBlogs,
  setNotification
}) => {
  const [likes, setLikes] = useState(blog.likes)

  const increaseLikes = async () => {
    const updatedBlog = {
      content: blog.content,
      author: blog.author,
      userId: blog.user.id,
      likes: likes + 1,
    }

    try {
      // Updates the blog likes
      const response = await blogService.increaseLikes(updatedBlog, blog.id)
      setLikes(response.likes)

      // Refresh the blog's list
      const blogs = await blogService.getAll()
      setBlogs(blogs)

    } catch(exception) {
      setNotification('error', 'Something went wrong, please try again later')
    }
  }

  const removeBlog = async () => {
    if(window.confirm('Are you sure you want to remove blog?')) {
      try {
        await blogService.remove(blog.id)
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch(exception) {
        setNotification('error', 'Something went wrong, please try again later')
      }
    }
  }

  const showDeleteButton = (username) => {
    if (user.username === username) {
      return (
        <button onClick={removeBlog}>remove</button>
      )
    }
  }

  return (
    <div className='blog'>
      <div>
        {blog.content}
      </div>
      <div>
          <p>{likes}</p>
          <button onClick={increaseLikes}>
            like
          </button>
      </div>
      <div className='blog_info'>
        <p>{blog.user.username}</p>
        {showDeleteButton(blog.user.username)}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
}

export default Blog