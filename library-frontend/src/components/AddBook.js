import React, { useState } from 'react'

const AddBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [newGenre, setNewGenre] = useState('')
  const [genres, setGenres] = useState([])

  const { addBook } = props

  const addGenre = () => {
    setGenres(genres.concat(newGenre))
    setNewGenre('')
  }

  const submitBook = async (event) => {
    event.preventDefault()
    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres: newGenre.length > 0 ? genres.concat(newGenre) : genres
      }
    })
    setTitle('')
    setAuthor('')
    setPublished('')
    setNewGenre('')
    setGenres([])
  }

  return (
    <div>
      <form onSubmit={submitBook}>
        <label>
          title{' '}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          author{' '}
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <br />
        <label>
          published{' '}
          <input
            type="text"
            value={published}
            onChange={(e) => setPublished(e.target.value)}
          />
        </label>
        <br />
        <label>
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
          <input type="button" value="add genre" onClick={addGenre} />
        </label>
        <br />
        <label>genres: {genres.map((genre) => `${genre} `)}</label>
        <br />
        <input type="submit" value="create book" />
      </form>
    </div>
  )
}

export default AddBook
