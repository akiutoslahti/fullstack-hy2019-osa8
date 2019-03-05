import React, { useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import BookList from './BookList'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const [books, setBooks] = useState(null)
  const [genreList, setGenreList] = useState(null)

  const client = useApolloClient()

  const { ALL_BOOKS } = props

  useEffect(() => {
    fetchBooks()
  }, [filter])

  const fetchBooks = async () => {
    if (filter) {
      const result = await client.query({
        query: ALL_BOOKS,
        variables: { genre: filter }
      })
      setBooks(result.data.allBooks)
    } else {
      const result = await client.query({
        query: ALL_BOOKS
      })
      setBooks(result.data.allBooks)
      setGenreList(extractGenreList(result.data.allBooks))
    }
  }

  const extractGenreList = (books) => {
    const genreArray = books.map((book) => book.genres)
    const flattenedGenres = [].concat.apply([], genreArray)
    const uniqueGenres = [...new Set(flattenedGenres)]
    return uniqueGenres
  }

  const GenreFilters = () => {
    return genreList
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

  if (!books || !genreList) {
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
      <BookList books={books} />
      <br />
      <GenreFilters />
    </div>
  )
}

export default Books
