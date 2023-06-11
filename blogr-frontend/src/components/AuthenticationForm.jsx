import  { useState } from 'react'
import PropTypes from 'prop-types'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

import loginService from '../services/login'
import registerService from '../services/register'
import blogService from '../services/blogs'

const AuthenticationForm = ({
  setUser,
  setNotification
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

    setNotification('success', `Welcome back ${user.username}!`)
  } catch (exception) {
    setNotification('error', 'Wrong username or password')
  }
}

const handleRegister = async event => {
  event.preventDefault()

  try {
    const user = await registerService.create({
      username, password
    })

    window.localStorage.setItem(
      'loggedBlogrAppUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')

    setNotification('success', `Welcome ${user.username}!`)
  } catch (exception) {
    setNotification('error', 'Wrong username or password')
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
        <p>
          {isNew ? 'Already have an account?' : "Dont't have an account yet?"}
          <button onClick={() => setIsNew(!isNew)}>
            {isNew ? 'Login' : 'Create one'}
          </button>
        </p>
    </div>
  )
}

AuthenticationForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired
}

export default AuthenticationForm