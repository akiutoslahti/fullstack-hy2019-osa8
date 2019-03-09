import React, { useState, useEffect } from 'react'
import { Subscription } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'

import Authors from './components/Authors'
import Books from './components/Books'
import AddBookForm from './components/AddBookForm'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

import ALL_AUTHORS from './graphql/queries/allAuthors'
import ALL_BOOKS from './graphql/queries/allBooks'
import CREATE_BOOK from './graphql/mutations/createBook'
import LOGIN from './graphql/mutations/login'
import AUTHOR_ADDED from './graphql/subscriptions/authorAdded'
import BOOK_ADDED from './graphql/subscriptions/bookAdded'

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
      {showAuthors && <Authors result={authorResults} token={token} />}
      {showBooks && <Books result={bookResults} />}
      {showAddBook && <AddBookForm addBook={addBook} />}
      {showLogin && (
        <LoginForm
          login={login}
          setToken={(token) => setToken(token)}
          resetVisibility={resetVisibility}
          setShowAuthors={setShowAuthors}
        />
      )}
      {showRecommend && <Recommend />}

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
