import React, { useState } from 'react'
import Select from 'react-select'
import { useApolloClient } from 'react-apollo-hooks'

const Authors = (props) => {
  const [name, setName] = useState({})
  const [born, setBorn] = useState('')

  const { result, ALL_AUTHORS, UPDATE_AUTHOR, token } = props
  const client = useApolloClient()

  const updateBirthyear = async (event) => {
    event.preventDefault()
    await client.mutate({
      mutation: UPDATE_AUTHOR,
      variables: { name: name.value, setBornTo: Number(born) },
      refetchQueries: [{ query: ALL_AUTHORS }]
    })
    setName({})
    setBorn('')
  }

  if (result.loading) {
    return <div>loading authors...</div>
  }

  const AuthorList = () => {
    return (
      <div>
        <h2>authors</h2>
        <table>
          <thead>
            <tr>
              <th />
              <th>born</th>
              <th>books</th>
            </tr>
          </thead>
          <tbody>
            {result.data.allAuthors.map((author, index) => {
              return (
                <tr key={index}>
                  <td>{author.name}</td>
                  <td>{author.born}</td>
                  <td>{author.bookCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <AuthorList />
      {token && (
        <div>
          <h2>set birthyear</h2>
          <form onSubmit={updateBirthyear}>
            <Select
              value={name}
              onChange={(selectedOption) => setName(selectedOption)}
              options={result.data.allAuthors.map((author) => {
                return {
                  value: author.name,
                  label: author.name
                }
              })}
            />
            <label>
              born{' '}
              <input
                type="text"
                name="born"
                value={born}
                onChange={(e) => setBorn(e.target.value)}
              />
            </label>
            <br />
            <input type="submit" value="update author" />
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors
