import { gql } from 'apollo-boost'
import AUTHOR_DETAILS from '../fragments/authorDetails'

const AUTHOR_ADDED = gql`
  subscription {
    authorAdded {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export default AUTHOR_ADDED
