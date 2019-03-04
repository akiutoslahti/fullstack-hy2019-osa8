const { ApolloServer, gql } = require('apollo-server')

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

mongoose.set('useFindAndModify', false)

const MONGODB_URI =
  'mongodb://testiseppo:testiseppo1@ds159185.mlab.com:59185/graphql'

console.log('connecting to MongoDB')
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filters = {}
      if (args.genre) {
        filters.genres = { $in: [args.genre] }
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        filters.author = author.id
      }
      const books = await Book.find({ ...filters }).populate('author')
      return books
    },
    allAuthors: () => {
      return Author.find({})
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const { title, published, author, genres } = args
      const foundAuthor = await Author.findOne({ name: author })
      if (foundAuthor) {
        const book = new Book({
          title,
          published,
          author: foundAuthor._id,
          genres
        })
        await book.save()
        return Book.findById(book._id).populate('author')
      }
      const newAuthor = new Author({ name: author })
      await newAuthor.save()
      const book = new Book({ title, published, author: newAuthor._id, genres })
      await book.save()
      return Book.findById(book._id).populate('author')
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      return author.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
