const userModel = require('../models/user')

module.exports = {
  resolvers: {
    Query: {
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Mutation: {
      createUser: async (root, args) => {
        const { username, favoriteGenre } = args
        const userFound = userModel.find({ username: username })
        if (userFound) {
          throw new UserInputError('duplicate user name')
        }

        const newUser = new userModel({ username, favoriteGenre })
        return newUser.save()
      }
    }
  }
}
