const { PubSub } = require('apollo-server')
const pubSub = new PubSub()

const bookModel = require('../models/book')
const authorModel = require('../models/author')

module.exports = {
  resolvers: {
    Query: {
      bookCount: () => bookModel.collection.countDocuments(),
      allBooks: async (root, args) => {
        const filters = {}
        if (args.genre) {
          filters.genres = { $in: [args.genre] }
        }
        if (args.author) {
          const author = await authorModel.findOne({ name: args.author })
          filters.author = author.id
        }
        const books = await bookModel.find({ ...filters }).populate('author')
        return books
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
        const { currentUser } = context
        if (!currentUser) {
          throw new AuthenticationError('not authenticated')
        }

        const { title, published, author, genres } = args
        if (!title || !published || !author || !genres) {
          throw new UserInputError('all fields must be provided')
        }

        let dbAuthor = await authorModel.findOne({ name: author })
        if (!dbAuthor) {
          const newAuthor = new authorModel({ name: author })
          await newAuthor.save()
          pubSub.publish('AUTHOR_ADDED', { authorAdded: newAuthor })
          dbAuthor = newAuthor
        }

        const book = new bookModel({
          title,
          published,
          author: dbAuthor._id,
          genres
        })
        await book.save()

        dbAuthor.books.push(book._id)
        await dbAuthor.save()

        const bookToReturn = await bookModel
          .findById(book._id)
          .populate('author')
        pubSub.publish('BOOK_ADDED', { bookAdded: bookToReturn })
        return bookToReturn
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubSub.asyncIterator(['BOOK_ADDED'])
      },
      authorAdded: {
        subscribe: () => pubSub.asyncIterator(['AUTHOR_ADDED'])
      }
    }
  }
}
