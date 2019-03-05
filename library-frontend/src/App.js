import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import Authors from './components/Authors'
import Books from './components/Books'
import AddBookForm from './components/AddBookForm'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

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
  query genreBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
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

const ME = gql`
  query {
    me {
      id
      username
      favoriteGenre
    }
  }
`

const App = () => {
  const [showAuthors, setShowAuthors] = useState(true)
  const [showBooks, setShowBooks] = useState(false)
  const [showAddBook, setShowAddbook] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRecommend, setShowRecommend] = useState(false)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const authorResults = useQuery(ALL_AUTHORS)
  const addBook = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }]
  })
  const login = useMutation(LOGIN)

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  })

  const resetVisibility = () => {
    setShowAuthors(false)
    setShowBooks(false)
    setShowAddbook(false)
    setShowLogin(false)
    setShowRecommend(false)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const Buttons = () => {
    return (
      <div>
        <button
          onClick={() => {
            resetVisibility()
            setShowAuthors(true)
          }}
        >
          authors
        </button>
        <button
          onClick={() => {
            resetVisibility()
            setShowBooks(true)
          }}
        >
          books
        </button>
        {token && (
          <button
            onClick={() => {
              resetVisibility()
              setShowAddbook(true)
            }}
          >
            add book
          </button>
        )}
        {!token && (
          <button
            onClick={() => {
              resetVisibility()
              setShowLogin(true)
            }}
          >
            login
          </button>
        )}
        {token && (
          <button
            onClick={() => {
              resetVisibility()
              setShowRecommend(true)
            }}
          >
            recommend
          </button>
        )}
        {token && (
          <button
            onClick={() => {
              resetVisibility()
              setShowAuthors(true)
              logout()
            }}
          >
            logout
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <Buttons />
      {showAuthors && (
        <Authors
          result={authorResults}
          ALL_AUTHORS={ALL_AUTHORS}
          token={token}
        />
      )}
      {showBooks && <Books ALL_BOOKS={ALL_BOOKS} />}
      {showAddBook && <AddBookForm addBook={addBook} />}
      {showLogin && (
        <LoginForm
          login={login}
          setToken={(token) => setToken(token)}
          resetVisibility={resetVisibility}
          setShowAuthors={setShowAuthors}
        />
      )}
      {showRecommend && <Recommend ME={ME} ALL_BOOKS={ALL_BOOKS} />}
    </div>
  )
}

export default App
