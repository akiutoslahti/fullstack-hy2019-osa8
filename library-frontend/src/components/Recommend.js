import React, { useState, useEffect } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import BookList from './BookList'

const Recommend = (props) => {
  const [recommends, setRecommends] = useState(null)
  const [favoriteGenre, setFavoriteGenre] = useState('')
  const { ME, GENRE_BOOKS } = props

  const client = useApolloClient()

  useEffect(() => {
    fetchGenreBooks()
  })

  const fetchGenreBooks = async () => {
    const ownDetails = await client.query({ query: ME })
    setFavoriteGenre(ownDetails.data.me.favoriteGenre)
    const myGenreBooks = await client.query({
      query: GENRE_BOOKS,
      variables: { genre: favoriteGenre }
    })
    setRecommends(myGenreBooks.data.allBooks)
  }

  if (!recommends) {
    return <div>loading recommendations...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>
      <BookList books={recommends} />
    </div>
  )
}

export default Recommend
