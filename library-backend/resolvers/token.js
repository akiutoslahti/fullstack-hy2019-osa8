const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  resolvers: {
    Mutation: {
      login: async (root, args) => {
        const user = await userModel.findOne({ username: args.username })
        if (!user || args.password !== 'secret123') {
          throw new UserInputError('wrong credentials')
        }

        const userForToken = {
          username: user.username,
          id: user._id
        }

        return { value: jwt.sign(userForToken, JWT_SECRET) }
      }
    }
  }
}
