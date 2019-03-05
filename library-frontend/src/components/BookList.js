import React from 'react'

const BookList = (props) => {
  const { books } = props

  return (
    <table>
      <thead>
        <tr>
          <th />
          <th>author</th>
          <th>published</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => {
          return (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default BookList
