import { gql } from 'apollo-boost'
import BOOK_DETAILS from '../fragments/bookDetails'

const ALL_BOOKS = gql`
  query allBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export default ALL_BOOKS
