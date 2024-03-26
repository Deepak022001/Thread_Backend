import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hey there, I am the GraphQL server!`,
        say: (_, { name }: { name: string }) => `Hello, ${name}!`,
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
