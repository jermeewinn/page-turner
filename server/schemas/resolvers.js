const { AuthenticationError } = require("apollo-server-express");
const { saveBook } = require("../controllers/user-controller");
//NOTE TO SELF: will need to get rid of const { saveBook } eventually
const { User } = require("../models");
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // Me query/GET me
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
        // User login mutation
        login: async (parent, { email, password }) => {
            // Find user by email. If not user, then throw AuthenticationError
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // Check if pw is coorect. If pw is not correct, throw AuthenticationError
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            
            // Assign token
            const token = signToken(user);
            return { token, user };
        },
        // User sign up mutation
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        // Saves books on the front-end to savedBooks list
        saveBook: async (parent, { book }, context) => {
            // saveBook structure similar to addFriend and addReaction in module content
            if (context.user) {
                const updateBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: book }},
                    { new: true }
                );
                return updateBook;
            }
            throw new AuthenticationError()
        },
        // Deletes books on the front-end from savedBooks list
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const userData = await User.findByIdAndDelete(
                    { _id: context.user._id },
                    { $pull: {savedBooks: bookId }},
                    { new: true }
                );
                return userData;
            } 
        }
    }

};

module.exports = resolvers;