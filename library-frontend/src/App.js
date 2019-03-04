import React, { Component } from 'react'
import { Query, Mutation, ApolloConsumer } from 'react-apollo'
import { gql } from 'apollo-boost'

import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const ALL_BOOKS = gql`
  {
    allBooks {
      title
      author {
        name
        born
        bookCount
      }
      published
    }
  }
`

const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
        bookCount
      }
      genres
    }
  }
`

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAuthors: false,
      showBooks: false,
      showAddBook: false
    }
  }

  componentDidMount() {
    this.setState((state) => {
      return {
        ...state,
        showAuthors: true
      }
    })
  }

  resetState = () => {
    this.setState(() => {
      return {
        showAuthors: false,
        showBooks: false,
        showAddBook: false
      }
    })
  }

  handleClick = (event) => {
    const { id } = event.target
    this.resetState()
    this.setState((state) => {
      const newState = { ...state }
      newState[id] = true
      return newState
    })
  }

  render() {
    return (
      <div>
        <button id="showAuthors" onClick={this.handleClick}>
          authors
        </button>
        <button id="showBooks" onClick={this.handleClick}>
          books
        </button>
        <button id="showAddBook" onClick={this.handleClick}>
          add book
        </button>
        {this.state.showAuthors ? (
          <ApolloConsumer>
            {(client) => (
              <Query query={ALL_AUTHORS}>
                {(result) => <Authors result={result} client={client} />}
              </Query>
            )}
          </ApolloConsumer>
        ) : null}
        {this.state.showBooks ? (
          <ApolloConsumer>
            {() => (
              <Query query={ALL_BOOKS}>
                {(result) => <Books result={result} />}
              </Query>
            )}
          </ApolloConsumer>
        ) : null}
        {this.state.showAddBook ? (
          <Mutation
            mutation={CREATE_BOOK}
            refetchQueries={[{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]}
          >
            {(addBook) => <AddBook addBook={addBook} />}
          </Mutation>
        ) : null}
      </div>
    )
  }
}

export default App
