import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [content, setContent] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      content: content
    })

    setContent('')
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="content">content:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>
        <button
          id='create'
          type="submit">
          create
        </button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
