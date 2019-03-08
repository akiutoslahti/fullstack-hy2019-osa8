const { AuthenticationError, UserInputError } = require('apollo-server')
const authorModel = require('../models/author')

module.exports = {
  resolvers: {
    Query: {
      authorCount: () => authorModel.collection.countDocuments(),
      allAuthors: () => {
        return authorModel.find({}).populate('book')
      }
    },
    Author: {
      bookCount: (root) => {
        return root.books.length
      }
    },
    Mutation: {
      editAuthor: async (root, args, context) => {
        const { currentUser } = context
        if (!currentUser) {
          throw new AuthenticationError('not authenticated')
        }

        const author = await authorModel.findOne({ name: args.name })
        if (!author) {
          throw new UserInputError('author not found by name provided')
        }

        author.born = args.setBornTo
        return author.save()
      }
    }
  }
}
