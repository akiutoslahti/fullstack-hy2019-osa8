const { gql } = require('apollo-server')

module.exports = {
  typeDef: gql`
    type Token {
      value: String!
    }

    extend type Mutation {
      login(username: String!, password: String!): Token
    }
  `
}
