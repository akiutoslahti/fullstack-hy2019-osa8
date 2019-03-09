import React, { useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import BookList from './BookList'

import ALL_BOOKS from '../graphql/queries/allBooks'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState(null)

  const client = useApolloClient()

  const { result } = props

  useEffect(() => {
    fetchBooks()
  }, [filter])

  const fetchBooks = async () => {
    if (filter) {
      const result = await client.query({
        query: ALL_BOOKS,
        variables: { genre: filter }
      })
      setFilteredBooks(result.data.allBooks)
    } else {
      setFilteredBooks(null)
    }
  }

  const GenreFilters = () => {
    const genreArray = result.data.allBooks.map((book) => book.genres)
    const flattenedGenres = [].concat.apply([], genreArray)
    const uniqueGenres = [...new Set(flattenedGenres)]
    return uniqueGenres
      .map((genre, index) => (
        <button key={index + 1} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))
      .concat(
        <button key={0} onClick={() => setFilter(null)}>
          all genres
        </button>
      )
  }

  if (result.loading) {
    return <div>loading books...</div>
  }

  return (
    <div>
      <h2>books</h2>
      {filter && (
        <div>
          in genre <strong>{filter}</strong>
        </div>
      )}
      <BookList books={filteredBooks ? filteredBooks : result.data.allBooks} />
      <br />
      <GenreFilters />
    </div>
  )
}

export default Books
