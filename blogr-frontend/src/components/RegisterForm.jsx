import PropTypes from 'prop-types'

const RegisterForm = ({
  handleRegister,
  username,
  setUsername,
  password,
  setPassword
}) => {
  return (
    <div>
      <h2>Register to Blogr</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            id='username'
            type='text'
            name='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button
          id='submit'
          type='submit'
        >
          Register
        </button>
      </form>
      <p>
        {/* Do not have an account yet? <a onClick={() => setIsNew(!isNew)}>Register</a> now! */}
      </p>
    </div>
  )
}

RegisterForm.propTypes = {
  handleRegister: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired
}

export default RegisterForm