const { AuthenticationError } = require("apollo-server-express");
const { saveBook } = require("../controllers/user-controller");
//NOTE TO SELF: will need to get rid of const { saveBook } eventually
const { User } = require("../models");
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // Me query
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate('saveBook');
                    return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        // User login
        login: async (parent { email, password }) => {
            const user = await User.findOne({ email });
            if(!user) {
                throw new AuthenticationError('No user found');
            }
        },
        addUser: {

        },
        saveBook: {

        },
        removeBook: {

        }
    },

};

module.exports = resolvers;