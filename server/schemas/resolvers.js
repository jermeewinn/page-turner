const { AuthenticationError } = require("apollo-server-express");
const { saveBook } = require("../controllers/user-controller");
const { User } = require("../models");
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // Me query
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate(saveBook);
                    return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {

    }
};

module.exports = resolvers;