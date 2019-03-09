import { gql } from 'apollo-boost'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`

export default AUTHOR_DETAILS
