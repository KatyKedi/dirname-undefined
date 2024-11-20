import express from 'express';
// Import the ApolloServer class
import {
  ApolloServer,
} from '@apollo/server';
import {
  expressMiddleware
} from '@apollo/server/express4';
import { authenticateToken } from './services/auth-service.js';
// Import the two parts of a GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});



// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  await db;

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));


  app.use(express.static('./client/dist'));


  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });

};

// Call the async function to start the server
startApolloServer();
