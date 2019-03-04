import React from 'react'

const Books = ({ result }) => {
  if (result.loading) {
    return <div>loading books...</div>
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <thead>
          <tr>
            <th />
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {result.data.allBooks.map((book, index) => {
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
    </div>
  )
}

export default Books
