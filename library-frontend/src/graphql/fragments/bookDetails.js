import { gql } from 'apollo-boost'
import AUTHOR_DETAILS from './authorDetails'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      ...AuthorDetails
    }
    published
    genres
  }
  ${AUTHOR_DETAILS}
`
export default BOOK_DETAILS
