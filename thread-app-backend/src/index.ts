import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { prismaClient } from './lib/db';

import createApolloGraphqlServer from './graphql';
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  app.use(express.json());
  app.get('/', (req, res) => {
    res.json({ message: 'Server is up and running' });
  });
  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(await createApolloGraphqlServer())
  );
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

init();
