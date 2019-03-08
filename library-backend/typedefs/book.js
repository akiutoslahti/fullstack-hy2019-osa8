const { gql } = require('apollo-server')

module.exports = {
  typeDef: gql`
    type Book {
      title: String!
      published: Int!
      author: Author!
      id: ID!
      genres: [String!]!
    }

    extend type Query {
      bookCount: Int!
      allBooks(author: String, genre: String): [Book!]!
    }

    extend type Mutation {
      addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
      ): Book
    }

    extend type Subscription {
      bookAdded: Book!
    }
  `
}
