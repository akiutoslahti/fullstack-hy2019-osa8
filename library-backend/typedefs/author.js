const { gql } = require('apollo-server')

module.exports = {
  typeDef: gql`
    type Author {
      name: String!
      id: ID!
      born: Int
      bookCount: Int!
    }

    extend type Query {
      authorCount: Int!
      allAuthors: [Author!]!
    }

    extend type Mutation {
      editAuthor(name: String!, setBornTo: Int!): Author
    }

    extend type Subscription {
      authorAdded: Author!
    }
  `
}
