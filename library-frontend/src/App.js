import React, { useState, useEffect } from 'react'
import { gql } from 'apollo-boost'
import { Subscription } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import Authors from './components/Authors'
import Books from './components/Books'
import AddBookForm from './components/AddBookForm'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      ...AuthorDetails
    }
    published
    genres
  }
  ${AUTHOR_DETAILS}
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const ALL_BOOKS = gql`
  query genreBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
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
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
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

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

const AUTHOR_ADDED = gql`
  subscription {
    authorAdded {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const App = () => {
  const [showAuthors, setShowAuthors] = useState(true)
  const [showBooks, setShowBooks] = useState(false)
  const [showAddBook, setShowAddbook] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRecommend, setShowRecommend] = useState(false)
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState(null)

  const client = useApolloClient()
  const authorResults = useQuery(ALL_AUTHORS)
  const bookResults = useQuery(ALL_BOOKS)
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

  const Notification = () => {
    if (notification) {
      return (
        <div style={{ color: notification.type === 'error' ? 'red' : 'green' }}>
          <h3>{notification.message}</h3>
        </div>
      )
    }
    return null
  }

  const clearNotification = () => {
    setNotification(null)
  }

  return (
    <div>
      <Buttons />
      <Notification />
      {showAuthors && (
        <Authors
          result={authorResults}
          ALL_AUTHORS={ALL_AUTHORS}
          UPDATE_AUTHOR={UPDATE_AUTHOR}
          token={token}
        />
      )}
      {showBooks && <Books result={bookResults} ALL_BOOKS={ALL_BOOKS} />}
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

      <Subscription
        subscription={BOOK_ADDED}
        onSubscriptionData={({ subscriptionData }) => {
          const addedBook = subscriptionData.data.bookAdded
          setNotification({
            message: `New book added: ${addedBook.title} by ${
              addedBook.author.name
            }`
          })
          setTimeout(() => {
            clearNotification()
          }, 5000)
          const dataInStore = client.readQuery({ query: ALL_BOOKS })
          dataInStore.allBooks.push(addedBook)
          client.writeQuery({
            query: ALL_BOOKS,
            data: dataInStore
          })
        }}
      >
        {() => null}
      </Subscription>
      <Subscription
        subscription={AUTHOR_ADDED}
        onSubscriptionData={({ subscriptionData }) => {
          const addedAuthor = subscriptionData.data.authorAdded
          const dataInStore = client.readQuery({ query: ALL_AUTHORS })
          dataInStore.allAuthors.push(addedAuthor)
          client.writeQuery({
            query: ALL_AUTHORS,
            data: dataInStore
          })
        }}
      >
        {() => null}
      </Subscription>
    </div>
  )
}

export default App
