import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { prismaClient } from './lib/db';

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there, I am the GraphQL server!`,
        say: (_, { name }: { name: string }) => `Hello, ${name}!`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          // Your createUser resolver logic goes here
          await prismaClient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: 'random_salt',
            },
          });
          return `User created: ${firstName} ${lastName}`;
        },
      },
    },
  });
  await gqlServer.start();
  app.use('/graphql', express.json(), expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

init().catch((error) => console.error(error));
