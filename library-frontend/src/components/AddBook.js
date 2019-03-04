import React, { Component } from 'react'

class AddBook extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      author: '',
      published: '',
      genre: '',
      genres: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.addGenre = this.addGenre.bind(this)
    this.submitBook = this.submitBook.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState((state) => {
      const newState = { ...state }
      newState[name] = value
      return newState
    })
  }

  addGenre() {
    this.setState((state) => {
      const newState = { ...state }
      newState.genres = state.genres.concat(state.genre)
      newState.genre = ''
      return newState
    })
  }

  async submitBook(event) {
    event.preventDefault()
    const { title, author, published, genres } = this.state
    await this.props.addBook({
      variables: { title, author, published: Number(published), genres }
    })
    this.setState({
      title: '',
      author: '',
      published: '',
      genre: '',
      genres: []
    })
  }

  render() {
    const { title, author, published, genre, genres } = this.state
    return (
      <div>
        <form onSubmit={this.submitBook}>
          <label>
            title{' '}
            <input
              type="text"
              name="title"
              value={title}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            author{' '}
            <input
              type="text"
              name="author"
              value={author}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            published{' '}
            <input
              type="text"
              name="published"
              value={published}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            <input
              type="text"
              name="genre"
              value={genre}
              onChange={this.handleChange}
            />
            <input type="button" value="add genre" onClick={this.addGenre} />
          </label>
          <br />
          <label>genres: {genres.map((genre) => `${genre} `)}</label>
          <br />
          <input type="submit" value="create book" />
        </form>
      </div>
    )
  }
}

export default AddBook
