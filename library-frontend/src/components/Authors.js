import React, { Component } from 'react'
import Select from 'react-select'
import { gql } from 'apollo-boost'

const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

class Authors extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedName: {},
      born: ''
    }

    this.changeHandler = this.changeHandler.bind(this)
    this.updateBirthyear = this.updateBirthyear.bind(this)
    this.selectHandler = this.selectHandler.bind(this)
  }

  changeHandler(event) {
    const { name, value } = event.target
    this.setState((state) => {
      const newState = { ...state }
      newState[name] = value
      return newState
    })
  }

  selectHandler(selectedOption) {
    this.setState((state) => {
      const newState = { ...state }
      newState.selectedName = selectedOption
      return newState
    })
  }

  async updateBirthyear(event) {
    event.preventDefault()
    const { selectedName, born } = this.state
    await this.props.client.mutate({
      mutation: UPDATE_AUTHOR,
      variables: { name: selectedName.value, setBornTo: Number(born) },
      refetchQueries: [{ query: ALL_AUTHORS }]
    })
    this.setState(() => {
      return {
        selectedName: {},
        born: ''
      }
    })
    this.forceUpdate()
  }

  render() {
    const { result } = this.props
    const { selectedName, born } = this.state

    if (result.loading) {
      return <div>loading authors...</div>
    }

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
        <h2>set birthyear</h2>
        <form onSubmit={this.updateBirthyear}>
          <Select
            value={selectedName}
            onChange={this.selectHandler}
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
              onChange={this.changeHandler}
            />
          </label>
          <br />
          <input type="submit" value="update author" />
        </form>
      </div>
    )
  }
}

export default Authors
