const { gql } = require('apollo-server')

const { typeDef: authorTypeDef } = require('./author')
const { typeDef: bookTypeDef } = require('./book')
const { typeDef: userTypeDef } = require('./user')
const { typeDef: tokenTypeDef } = require('./token')

const Query = gql`
  type Query {
    _empty: String
  }
`
const Mutation = gql`
  type Mutation {
    _empty: String
  }
`
const Subscription = gql`
  type Subscription {
    _empty: String
  }
`

module.exports = {
  typeDefs: [
    Query,
    Mutation,
    Subscription,
    authorTypeDef,
    bookTypeDef,
    userTypeDef,
    tokenTypeDef
  ]
}
