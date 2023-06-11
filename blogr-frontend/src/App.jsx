import { useState, useEffect } from 'react'

import AuthenticationForm from './components/AuthenticationForm'
import Notification from './components/Notification'
import BlogList from './components/BlogList'

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

  const setNotification = (type, message, timeout = 5000) => {
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
          setNotification={setNotification}
        />
      }
      {user &&
        <BlogList
          user={user}
          setUser={setUser}
          setNotification={setNotification}
        />
      }
    </div>
  )
}

export default App
