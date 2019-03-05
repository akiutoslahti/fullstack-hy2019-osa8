import React, { useState } from 'react'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login, setToken } = props

  const submitLogin = async (event) => {
    event.preventDefault()

    const result = await login({ variables: { username, password } })

    const token = result.data.login.value

    setToken(token)
    localStorage.setItem('library-user-token', token)

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={submitLogin}>
        <label>
          username{' '}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Login" />
      </form>
    </div>
  )
}

export default LoginForm
