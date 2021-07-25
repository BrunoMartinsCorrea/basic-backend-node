import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';

const server = express();

const schema = buildSchema(`
  type Hello {
    id: Int
    text: String
  }

  type Query {
    hello: Hello
    catchau: String
  }
`);

const rootValue = {
  hello: () => ({ id: 1, text: 'asd' }),
  catchau: () => 'Hello world!',
};

server.use('/graphql', graphqlHTTP({ schema, rootValue, graphiql: true }));
