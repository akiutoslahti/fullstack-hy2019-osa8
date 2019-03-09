import { gql } from 'apollo-boost'
import AUTHOR_DETAILS from '../fragments/authorDetails'

const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export default UPDATE_AUTHOR
