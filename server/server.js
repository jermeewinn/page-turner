const express = require('express');
const { authMiddleware } = require('./utils/auth');
// Import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// Import typeDefs & resolvers, get rid of routes
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // Create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });
  // Start Apollo Server
  await server.start();
  // Integrate our Apollo server witht eh Express application as middleware
  server.applyMiddleware({ app });

  // Log where we can go to test our GQP API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// Get rid of routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
