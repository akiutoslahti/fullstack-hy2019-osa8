const { merge } = require('lodash')

const { resolvers: authorResolvers } = require('./author')
const { resolvers: bookResolvers } = require('./book')
const { resolvers: userResolvers } = require('./user')
const { resolvers: tokenResolvers } = require('./token')

const resolvers = merge(
  authorResolvers,
  bookResolvers,
  userResolvers,
  tokenResolvers
)

module.exports = {
  resolvers
}
