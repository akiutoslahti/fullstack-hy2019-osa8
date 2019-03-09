import { gql } from 'apollo-boost'
import BOOK_DETAILS from '../fragments/bookDetails'

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export default BOOK_ADDED
