const { gql } = require('apollo-server')

module.exports = {
  typeDef: gql`
    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    extend type Query {
      me: User
    }

    extend type Mutation {
      createUser(username: String!, favoriteGenre: String!): User
    }
  `
}
