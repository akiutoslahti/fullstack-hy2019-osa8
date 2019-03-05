const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError
} = require('apollo-server')

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const pubSub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

mongoose.set('useFindAndModify', false)

const MONGODB_URI =
  'mongodb://testiseppo:testiseppo1@ds159185.mlab.com:59185/graphql'

const JWT_SECRET = 'very secret secret'

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
    authorAdded: Author!
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
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id })
      return books.length
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

      let dbAuthor = await Author.findOne({ name: author })
      if (!dbAuthor) {
        const newAuthor = new Author({ name: author })
        await newAuthor.save()
        pubSub.publish('AUTHOR_ADDED', { authorAdded: newAuthor })
        dbAuthor = newAuthor
      }

      const book = new Book({
        title,
        published,
        author: dbAuthor._id,
        genres
      })
      await book.save()

      const bookToReturn = await Book.findById(book._id).populate('author')
      pubSub.publish('BOOK_ADDED', { bookAdded: bookToReturn })
      return bookToReturn
    },
    editAuthor: async (root, args, context) => {
      const { currentUser } = context
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new UserInputError('author not found by name provided')
      }

      author.born = args.setBornTo
      return author.save()
    },
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args
      const userFound = User.find({ username: username })
      if (userFound) {
        throw new UserInputError('duplicate user name')
      }

      const newUser = new User({ username, favoriteGenre })
      return newUser.save()
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret123') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authorization = req ? req.headers.authorization : null
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(authorization.substring(7), JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
