import { gql } from 'apollo-boost'

const ME = gql`
  query {
    me {
      id
      username
      favoriteGenre
    }
  }
`

export default ME
