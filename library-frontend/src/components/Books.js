import React, { useState } from 'react'
import BookList from './BookList'

const Books = ({ result }) => {
  const [filter, setFilter] = useState(null)

  if (result.loading) {
    return <div>loading books...</div>
  }

  const genreArray = result.data.allBooks.map((book) => book.genres)
  const flattenedGenres = [].concat.apply([], genreArray)
  const uniqueGenres = [...new Set(flattenedGenres)]

  const GenreFilters = () => {
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

  return (
    <div>
      <h2>books</h2>
      {filter && (
        <div>
          in genre <strong>{filter}</strong>
        </div>
      )}
      <BookList
        books={result.data.allBooks.filter((book) =>
          filter ? book.genres.includes(filter) : true
        )}
      />
      <br />
      <GenreFilters />
    </div>
  )
}

export default Books
