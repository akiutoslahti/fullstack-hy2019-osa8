import React, { useState } from 'react'
import { Query, Mutation, ApolloConsumer } from 'react-apollo'
import { gql } from 'apollo-boost'

import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'
import Login from './components/Login'

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

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const App = (props) => {
  const [showAuthors, setShowAuthors] = useState(true)
  const [showBooks, setShowBooks] = useState(false)
  const [showAddBook, setShowAddbook] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const hideAll = () => {
    setShowAuthors(false)
    setShowBooks(false)
    setShowAddbook(false)
    setShowLogin(false)
  }

  return (
    <div>
      <button
        id="showAuthors"
        onClick={() => {
          hideAll()
          setShowAuthors(true)
        }}
      >
        authors
      </button>
      <button
        id="showBooks"
        onClick={() => {
          hideAll()
          setShowBooks(true)
        }}
      >
        books
      </button>
      <button
        id="showAddBook"
        onClick={() => {
          hideAll()
          setShowAddbook(true)
        }}
      >
        add book
      </button>
      <button
        id="showLogin"
        onClick={() => {
          hideAll()
          setShowLogin(true)
        }}
      >
        login
      </button>
      {showAuthors ? (
        <ApolloConsumer>
          {(client) => (
            <Query query={ALL_AUTHORS}>
              {(result) => (
                <Authors
                  result={result}
                  client={client}
                  ALL_AUTHORS={ALL_AUTHORS}
                />
              )}
            </Query>
          )}
        </ApolloConsumer>
      ) : null}
      {showBooks ? (
        <ApolloConsumer>
          {() => (
            <Query query={ALL_BOOKS}>
              {(result) => <Books result={result} />}
            </Query>
          )}
        </ApolloConsumer>
      ) : null}
      {showAddBook ? (
        <Mutation
          mutation={CREATE_BOOK}
          refetchQueries={[{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]}
        >
          {(addBook) => <AddBook addBook={addBook} />}
        </Mutation>
      ) : null}
      {showLogin ? (
        <Mutation mutation={LOGIN}>
          {(login) => <Login login={login} />}
        </Mutation>
      ) : null}
    </div>
  )
}

export default App
