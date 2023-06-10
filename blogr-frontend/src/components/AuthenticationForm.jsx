import  { useState } from 'react'
import PropTypes from 'prop-types'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import loginService from '../services/login'
import blogService from '../services/blogs'

const AuthenticationForm = ({
  setUser,
  handleMessage
}) => {
  const [isNew, setIsNew] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username, password
    })

    window.localStorage.setItem(
      'loggedBlogrAppUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')

    handleMessage('success', `Welcome back ${user.username}!`)
  } catch (exception) {
    handleMessage('error', 'Wrong username or password')
  }
}

const handleRegister = async event => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username, password
    })

    window.localStorage.setItem(
      'loggedBlogrAppUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')

    handleMessage('success', `Welcome back ${user.username}!`)
  } catch (exception) {
    handleMessage('error', 'Wrong username or password')
  }
}

  return (
    <div>
      {isNew ? (
          <RegisterForm
            handleRegister={handleRegister}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        ) : (
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        )}
        <button onClick={() => setIsNew(!isNew)}>
          {isNew ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
    </div>
  )
}

AuthenticationForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  handleMessage: PropTypes.func.isRequired
}

export default AuthenticationForm