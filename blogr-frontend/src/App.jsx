import { useState, useEffect } from 'react'
import AuthenticationForm from './components/AuthenticationForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'

const App = () => {
  // Alert handling
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // Login and user handling
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogrAppUser')
    
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleMessage = (type, message, timeout = 5000) => {
    setMessageType(type)
    setMessage(message)

    setTimeout(() => {
      setMessageType('')
      setMessage('')
    }, timeout)
  }

  return (
    <div>
      <Notification
        message={message}
        messageType={messageType}
      />
      {!user && // If there is no user currently logged in
        <AuthenticationForm
          setUser={setUser}
          handleMessage={handleMessage}
        />
      }
      {user &&
        <BlogList
          user={user}
          setUser={setUser}
          message={message}
          setMessage={setMessage}
          messageType={messageType}
          setMessageType={setMessageType}
        />
      }
    </div>
  )
}

export default App
