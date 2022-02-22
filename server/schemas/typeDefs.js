const { gql } = require('apollo-server-express');

const typeDefs = gql`
    input customBook {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }    

    type Query {
            me: User
        }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(email: String!, password: String!, username: String!): Auth
        saveBook(book: customBook): User
        removeBook(bookId: ID!): User        
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`;

module.exports = typeDefs;