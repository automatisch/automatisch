import { buildSchema } from 'graphql';

const graphQLSchema = buildSchema(`
  type Query {
    hello: String
  }
`);

export default graphQLSchema;
